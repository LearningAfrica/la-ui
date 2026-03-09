import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "@/stores/auth/auth-slice";
import { authActions } from "@/stores/auth/auth-slice";
import organizationReducer from "@/stores/organization/organization-slice";
import tableFiltersReducer from "@/stores/filters/table-filters-slice";
import modalsReducer from "@/stores/filters/modal-slice";
import { setAuthHelpers } from "@/lib/api/index";
import { createCookieStorage } from "@/stores/cookie-storage";

const storage = createCookieStorage();

const authPersistConfig = {
  key: "__b98e774a8e41b3fcf09a___au",
  version: 1,
  storage,
};

const organizationPersistConfig = {
  key: "organization-storage",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  organization: persistReducer(organizationPersistConfig, organizationReducer),
  tableFilters: tableFiltersReducer,
  modals: modalsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// Wire up the API client with live state accessors.
// Called once — closures always read fresh state from store.getState().
setAuthHelpers(
  () => store.getState().auth.accessToken ?? null,
  () => store.dispatch(authActions.logout()),
  () => store.getState().auth.refreshToken ?? null,
  (access: string, refresh: string) =>
    store.dispatch(authActions.updateTokens({ access, refresh }))
);
