import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  selectTableData,
  selectColumnSettings,
  setActiveImage,
} from "@/app/store/slices/table-slice";
import {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { isValidHttpUrl } from "@/lib/url";
import {
  FilterableColumnValues,
  SelectFilterSection,
} from "./select-filter-section";
import {
  FilterColumnValueChange,
  filterColumnValuesReducer,
} from "@/reducers/filter-column-values";

declare module "@tanstack/react-table" {
  interface FilterFns {
    stringArrayIncludes: FilterFn<unknown>;
  }
}

export function ImageTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchByColumn, setSearchByColumn] = useState("");
  const [columns, setColumns] = useState<ColumnDef<object>[]>([]);

  const [filterColumnValues, dispatchFilterColumnValues] = useReducer(
    filterColumnValuesReducer,
    {},
  );

  const dispatch = useAppDispatch();
  const tableData = useAppSelector(selectTableData);
  const tableColumns = useAppSelector(selectColumnSettings);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },

    filterFns: {
      stringArrayIncludes: (row, cId, filterValue) => {
        const value = row.getValue(cId);
        if (typeof value !== "string") {
          console.warn(
            "This filter is meant to be used with strings.",
            `Got "${typeof value}" type instead:`,
            value,
          );
          return true;
        }

        const v = value.toLowerCase();

        /** currently can be assumed that filterValue array is string[]
         * and all are lowercase @see initializeFilterColumnValues */
        if (Array.isArray(filterValue)) {
          return filterValue.includes(v);
        }
        if (typeof filterValue !== "string") {
          console.warn(
            "FilterValue is expected to be string.",
            `Got "${typeof filterValue}":`,
            filterValue,
          );
          return true;
        }
        return v.includes(filterValue.toLowerCase());
      },
    },
  });

  const filterColumnValueChange: FilterColumnValueChange = async (
    column,
    value,
  ) => {
    dispatchFilterColumnValues({
      type: "change_filter",
      payload: { column, value },
    });

    // I can't believe I have to do this twice...
    // https://react.dev/reference/react/useReducer#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value
    const fcv = filterColumnValuesReducer(filterColumnValues, {
      type: "change_filter",
      payload: { column, value },
    });

    const newColumnFilters: { [key: string]: ColumnFilter } = {};
    Object.keys(fcv).forEach((ck) => {
      Object.entries(fcv[ck])
        .filter(([, shouldBeFiltered]) => shouldBeFiltered)
        .forEach((v) => {
          const value = v[0];

          if (ck in newColumnFilters) {
            const columnFilter = newColumnFilters[ck];

            if (Array.isArray(columnFilter.value)) {
              columnFilter.value.push(value);
            } else {
              columnFilter.value = [columnFilter.value, value];
            }
          } else {
            newColumnFilters[ck] = { id: ck, value: value };
          }
        });
    });

    setColumnFilters(Object.values(newColumnFilters));
  };

  const initializeFilterColumnValues = useCallback(() => {
    dispatchFilterColumnValues({ type: "reset" });

    tableColumns.forEach((column) => {
      if (column.filter) {
        const columnUniqueFilterValues: FilterableColumnValues = {};
        for (let i = 0, n = tableData.length; i < n; i++) {
          const value = tableData[i][column.name];
          if (typeof value !== "string") {
            // this is meant to be used with strings only
            continue;
          }

          const v = value.toLowerCase();
          columnUniqueFilterValues[v] = false;
        }

        dispatchFilterColumnValues({
          type: "set_column",
          payload: { column: column.name, values: columnUniqueFilterValues },
        });
      }
    });
  }, [tableColumns, tableData]);

  const initializeColumns = useCallback(() => {
    setColumns(() => {
      const result: React.SetStateAction<ColumnDef<object>[]> =
        tableColumns.map((x) => {
          if (x.searchBy) {
            setSearchByColumn(x.name);
          }
          if (x.hide) {
            setColumnVisibility((previousValue) => ({
              ...previousValue,
              [x.name]: false,
            }));
          }

          return {
            id: x.name,
            accessorKey: x.name,
            header: ({ column }) => {
              if (!x.sort) return x.name;

              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {x.name}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            },
            enableSorting: x.sort,
            enableHiding: true,
            cell: ({ row }) => {
              const value = row.getValue(x.name) as string;
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [hasError, setHasError] = useState(false);

              if (isValidHttpUrl(value)) {
                if (!hasError) {
                  return (
                    <img
                      src={value}
                      className="h-32"
                      onError={() => setHasError(true)}
                      onClick={() => dispatch(setActiveImage(value))}
                    ></img>
                  );
                }

                return (
                  <Button asChild variant={"link"}>
                    <a href={value} target="_blank">
                      link
                    </a>
                  </Button>
                );
              }

              return value;
            },

            filterFn: "stringArrayIncludes",
          };
        });

      return result;
    });
  }, [dispatch, tableColumns]);

  useEffect(() => {
    initializeFilterColumnValues();
    initializeColumns();
  }, [initializeColumns, initializeFilterColumnValues]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {searchByColumn && (
          <Input
            placeholder={`Filter by ${searchByColumn.trim().toLowerCase()}...`}
            value={
              (table.getColumn(searchByColumn)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) => {
              table
                .getColumn(searchByColumn)
                ?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        )}

        <SelectFilterSection
          filterColumnValues={filterColumnValues}
          filterColumnValueChange={filterColumnValueChange}
        ></SelectFilterSection>

        {tableColumns.length !== 0 && (
          <DropdownMenu>
            {/* choose visible columns */}
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        {/* table footer */}
        <div className="flex-1 text-sm text-muted-foreground">
          Page{" "}
          {Math.min(
            table.getState().pagination.pageIndex + 1,
            table.getPageCount(),
          )}{" "}
          of {table.getPageCount()}
          <br></br>
          Showing {table.getPaginationRowModel().rows.length} rows out of{" "}
          {table.getRowCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
