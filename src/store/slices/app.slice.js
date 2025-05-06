import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
  selectedDirection: "ltr",
  appLoading: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,

  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload.language;
      state.selectedDirection = ["ps", "dr"].includes(action.payload.language)
        ? "rtl"
        : "ltr";
    },
  },
});

export const { changeLanguage } = appSlice.actions;
