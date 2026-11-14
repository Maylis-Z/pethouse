
import { createSlice } from "@reduxjs/toolkit";

const getSavedAuth = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      return {
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
      };
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getSavedAuth(),

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
