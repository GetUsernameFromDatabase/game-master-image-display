import { configureStore, combineSlices } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tableSlice } from "./slices/table-slice";

import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/app/store/persistence";

const rootReducer = combineSlices(tableSlice);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    //@ts-expect-error some type error that does not seem to affect anything
    middleware: (gDM) => gDM().concat(createStateSyncMiddleware()),
  });
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore(loadFromLocalStorage());
store.subscribe(() => saveToLocalStorage(store.getState()));
initMessageListener(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
