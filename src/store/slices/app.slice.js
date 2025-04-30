import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: "en",
  appLoading: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,

  reducers: {
    changeState: (state, action) => {
      state.state = action.payload.state;
    },
  },
});

export const { changeState } = appSlice.actions;
