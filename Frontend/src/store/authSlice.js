import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,
  isAuthChecking: true, // true initially - we're checking auth on app load
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
      state.isAuthChecking = false;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.isAuthChecking = false;
    },
    authCheckComplete: (state) => {
      state.isAuthChecking = false;
    },
  },
});

export const { login, logout, authCheckComplete } = authSlice.actions;
export default authSlice.reducer;
