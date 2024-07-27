import { useAppSelector } from '@/app/store/hooks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  selectTableData,
  selectColumnSettings,
} from '@/app/store/slices/table-slice';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Input } from './ui/input';
import { isValidHttpUrl } from '@/lib/url';

export function ImageTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchByColumn, setSearchByColumn] = useState('');
  const [columns, setColumns] = useState<ColumnDef<object>[]>([]);

  const tableData = useAppSelector(selectTableData);
  const tableColumns = useAppSelector(selectColumnSettings);

  useEffect(() => {
    setColumns(
      tableColumns.map((x) => {
        if (x.searchBy) {
          setSearchByColumn(x.name);
        }
        if (x.hide) {
          setColumnVisibility((previousValue) => ({
            [x.name]: false,
            ...previousValue,
          }));
        }

        return {
          id: x.name,
          accessorKey: x.name,
          header: x.name,
          enableSorting: x.sort,
          enableHiding: true,
          cell: ({ row }) => {
            const value = row.getValue(x.name) as string;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [hasError, setHasError] = useState(false);

            if (!hasError && isValidHttpUrl(value)) {
              return (
                <img
                  src={value}
                  className='h-32'
                  onError={() => setHasError(true)}
                ></img>
              );
            }
            return value;
          },
        };
      }),
    );
  }, [tableColumns]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        {searchByColumn && (
          <Input
            placeholder={`Filter by ${searchByColumn.trim().toLowerCase()}...`}
            value={
              (table.getColumn(searchByColumn)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) => {
              table
                .getColumn(searchByColumn)
                ?.setFilterValue(event.target.value);
            }}
            className='max-w-sm'
          />
        )}
        {tableColumns.length !== 0 && (
          <DropdownMenu>
            {/* choose visible columns */}
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
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

      <div className='rounded-md border'>
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
                  data-state={row.getIsSelected() && 'selected'}
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
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-end space-x-2 py-4'>
        {/* table footer */}
        <div className='flex-1 text-sm text-muted-foreground'>
          Page{' '}
          {Math.min(
            table.getState().pagination.pageIndex + 1,
            table.getPageCount(),
          )}{' '}
          of {table.getPageCount()}
          <br></br>
          Showing {table.getPaginationRowModel().rows.length} rows out of {table.getRowCount()}
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
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
