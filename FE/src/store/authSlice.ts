import { createSlice } from "@reduxjs/toolkit";
export interface authInfo {
  isLogin: boolean;
  userInfo: { name: string } | null;
}
const initialState: authInfo = {
  isLogin: false,
  userInfo: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInFo: (state, action) => {
      state.userInfo = action.payload;
    },
    loginSetState: (state) => {
      state.isLogin = true;
    },
    logoutSetState: (state) => {
      state.isLogin = false;
    },
    AutoLogin: () => {
      return;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginSetState, logoutSetState, setUserInFo } = authSlice.actions;

export default authSlice.reducer;
