/* eslint-disable @typescript-eslint/no-explicit-any */
import { type PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../create-app-slice';
import { BoxProperties } from '@/components/data-display-box';

export interface TableSliceState {
  data: any[];
  columnSettings: BoxProperties[];
  activeImage: string;
}
const initialState: TableSliceState = {
  data: [],
  columnSettings: [],
  activeImage: '',
};

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
    setActiveImage: create.reducer(
      (state, action: PayloadAction<TableSliceState['activeImage']>) => {
        state.activeImage = action.payload;
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
    selectActiveImage: (slice) => slice.activeImage,
  },
});

export const {
  selectTableData,
  selectTableKeys,
  selectColumnSettings,
  selectActiveImage,
} = tableSlice.selectors;
export const { setTableData, setColumnSettings, setActiveImage } =
  tableSlice.actions;
