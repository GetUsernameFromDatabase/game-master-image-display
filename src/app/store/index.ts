import { configureStore, combineSlices } from '@reduxjs/toolkit';
import { tableSlice } from './slices/table-slice';
import { setupListeners } from '@reduxjs/toolkit/query';

const rootReducer = combineSlices(tableSlice);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
