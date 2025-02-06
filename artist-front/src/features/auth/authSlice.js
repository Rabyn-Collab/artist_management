import { createSlice } from "@reduxjs/toolkit";
import { getCookie, removeCookie, setCookie } from "../../app/local";




export const authSlice = createSlice({
  name: 'userSlice',
  initialState: {
    user: getCookie(),
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      setCookie(action.payload);
    },
    removeUser: (state) => {
      state.user = null;
      removeCookie();
    },
  },
});


export const { addUser, removeUser } = authSlice.actions;