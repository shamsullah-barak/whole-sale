import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchExpenses } from "../actions/expenses.actions";

const initialState = {
  expenses: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchExpensesAsync = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const expenses = await fetchExpenses();
    return expenses;
  }
);

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpensesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });
  },
});
