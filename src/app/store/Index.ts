import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import accountReducer from "./slices/accountSlice";
import uiReducer from "./slices/uiSlice"

// اگر RTK Query API اضافه شد، اینجا inject میشه
// import { api } from "./api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    ui: uiReducer,
    // [api.reducerPath]: api.reducer, // در صورت استفاده از RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
      immutableCheck: true,
    })
    // .concat(api.middleware), // در صورت استفاده از RTK Query
});

// Types برای useSelector و useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
