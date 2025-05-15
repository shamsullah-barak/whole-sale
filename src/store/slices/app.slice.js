import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
  selectedDirection: "ltr",
  appLoading: false,
  fontFamily: "Roboto, sans-serif",
  fontOptions: [
    { label: "Naskh", value: "Naskh" },
    { label: "Nastalik", value: "Nastalik" },
    { label: "QalamMajeed", value: "QalamMajeed" },
    { label: "Roboto, sans-serif", value: "Roboto, sans-serif" },
  ],
};

export const appSlice = createSlice({
  name: "app",
  initialState,

  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload.language;
      state.appLoading = true;
      state.selectedDirection = ["ps", "dr"].includes(action.payload.language)
        ? "rtl"
        : "ltr";
    },

    closeAppLoading: (state) => {
      state.appLoading = false;
    },

    changeFontFamily: (state, action) => {
      state.fontFamily = action.payload.fontFamily;
    },
  },
});

export const { changeLanguage, closeAppLoading, changeFontFamily } =
  appSlice.actions;
