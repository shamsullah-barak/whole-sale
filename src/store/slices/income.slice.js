import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchIncome } from "../actions/incomes.actions";

const initialState = {
  incomes: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchIncomeAsync = createAsyncThunk(
  "income/fetchIncome",
  async () => {
    const income = await fetchIncome();
    return income;
  }
);

export const incomeSlice = createSlice({
  name: "income",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });
  },
});
