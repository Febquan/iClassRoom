import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface SidebarInfo {
  isOpen: boolean;
  isOpenHover: boolean;
}
const initialState: SidebarInfo = {
  isOpen: false,
  isOpenHover: false,
};

export const sidebarSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setOpenHoverSideBar: (state, action: PayloadAction<boolean>) => {
      state.isOpenHover = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSideBar, setOpenHoverSideBar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
