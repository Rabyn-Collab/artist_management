import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "./mainApi";
import { authSlice } from "../features/auth/authSlice";



export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [mainApi.reducerPath]: mainApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    mainApi.middleware
  ])



});
