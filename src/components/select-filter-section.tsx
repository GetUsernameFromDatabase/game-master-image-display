import { FunnelPlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FilterColumnValueChange } from "@/reducers/filter-column-values";

/**  `{tableColumn.name: [values]}` */
export interface FilterColumnValues {
  [key: string]: { [key: string]: boolean };
}

export type FilterableColumnValues =
  FilterColumnValues[keyof FilterColumnValues];

export const SelectFilterSection = ({
  filterColumnValues,
  filterColumnValueChange,
}: {
  filterColumnValues: FilterColumnValues;
  filterColumnValueChange: FilterColumnValueChange;
}) => {
  const columnKeys = Object.keys(filterColumnValues);

  return (
    <>
      {columnKeys.map((columnKey) => {
        return (
          <DropdownMenu key={columnKey}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {columnKey} <FunnelPlus className="ml-2 h-4 w-4" />
                {/** TODO: Filter ICON */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(filterColumnValues[columnKey]).map(
                ([key, isChecked]) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={key}
                      className="capitalize"
                      checked={isChecked}
                      onCheckedChange={() =>
                        filterColumnValueChange(columnKey, key)
                      }
                    >
                      {key} {isChecked}
                    </DropdownMenuCheckboxItem>
                  );
                },
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </>
  );
};
