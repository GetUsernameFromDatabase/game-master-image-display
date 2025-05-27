import type { RootState } from "@/app/store";

const localStorageKey = "image-view-with-category-state";

export function saveToLocalStorage(state: RootState) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem(localStorageKey, serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

export function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem(localStorageKey);
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState) as RootState;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}
