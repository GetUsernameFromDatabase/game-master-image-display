import {
  FilterableColumnValues,
  FilterColumnValues,
} from "@/components/select-filter-section";

export type FilterColumnValueChange = (
  column: keyof FilterColumnValues,
  value: keyof FilterableColumnValues,
) => void;

type Action =
  | {
      type: "change_filter";
      payload: {
        column: keyof FilterColumnValues;
        value: keyof FilterableColumnValues;
      };
    }
  | { type: "set_state"; payload: FilterColumnValues }
  | {
      type: "set_column";
      payload: {
        column: keyof FilterColumnValues;
        values: FilterableColumnValues;
      };
    }
  | { type: "reset" };

export function filterColumnValuesReducer(
  state: FilterColumnValues,
  action: Action,
) {
  switch (action.type) {
    case "change_filter": {
      const column = action.payload.column;
      const columnValue = action.payload.value;

      return {
        ...state,
        [column]: {
          ...state[column],
          [columnValue]: !state[column][columnValue],
        },
      };
    }
    case "set_state":
      return action.payload;

    case "set_column":
      return { ...state, [action.payload.column]: action.payload.values };

    case "reset":
      return {};

    default:
      throw Error("Unknown action");
  }
}
