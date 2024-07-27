/* eslint-disable @typescript-eslint/no-explicit-any */
import { type PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../create-app-slice';
import { BoxProperties } from '@/components/data-display-box';

export interface TableSliceState {
  data: any[];
  columnSettings: BoxProperties[];
}
const initialState: TableSliceState = { data: [], columnSettings: [] };

// If you are not using async thunks you can use the standalone `createSlice`.
export const tableSlice = createAppSlice({
  name: 'table',
  initialState,
  reducers: (create) => ({
    setTableData: create.reducer(
      (state, action: PayloadAction<TableSliceState['data']>) => {
        state.data = action.payload;
      },
    ),
    setColumnSettings: create.reducer(
      (state, action: PayloadAction<BoxProperties[]>) => {
        state.columnSettings = action.payload.sort((a, b) => a.index - b.index);
      },
    ),
  }),
  selectors: {
    selectTableData: (slice) => slice.data,
    selectTableKeys: (slice) => {
      if (slice.data.length) {
        const keys = Object.keys(slice.data[0]);
        return keys;
      }
      return [];
    },
    selectColumnSettings: (slice) => slice.columnSettings,
  },
});

export const { selectTableData, selectTableKeys, selectColumnSettings } =
  tableSlice.selectors;
export const { setTableData, setColumnSettings } = tableSlice.actions;
