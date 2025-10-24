import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
  selectedDirection: "ltr",
  themeDirection: "ltr",
  appLoading: false,
  fontFamily: "Nastalik",
  fontOptions: [
    {
      label: "System (Browser default)",
      value:
        'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    },
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
      state.themeDirection = state.selectedDirection;
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
