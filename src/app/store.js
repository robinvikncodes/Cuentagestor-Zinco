import { configureStore } from "@reduxjs/toolkit";
import credentials from "../features/credentials";
import snackbar from "../features/snackbar";
import setting from "../features/setting";
import expireState from "../features/expireState";

export const store = configureStore({
  reducer: { credentials, snackbar, setting, expireState },
});
