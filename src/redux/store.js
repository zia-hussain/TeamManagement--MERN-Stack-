// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { thunk } from "redux-thunk";
import userReducer from "./features/userSlice";
import teamsReducer from "./teamsReducer";
import themeSlice from "./features/themeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    teams: teamsReducer,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
