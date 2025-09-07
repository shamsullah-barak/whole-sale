import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardData } from "../actions/dashboard.action";

const initialState = {
  salesGraph: {},
  cards: [],
  loading: false,
};

// async reducers
export const dashboardDataAsync = createAsyncThunk(
  "dashboard/dashboardData",
  async () => {
    const data = await dashboardData();
    return data;
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(dashboardDataAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(dashboardDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        const newArray = [];
        newArray.push(action.payload.purchases);
        newArray.push(action.payload.sales);
        newArray.push(action.payload.incomes);
        newArray.push(action.payload.expenses);
        // state.cards.push(action.payload.purchases);
        // state.cards.push(action.payload.sales);
        // state.cards.push(action.payload.incomes);
        // state.cards.push(action.payload.expenses);
        state.cards = [...newArray];
        state.salesGraph = action.payload.salesGraph;
      });
  },
});
