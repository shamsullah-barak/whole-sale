import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchExpenses } from "../actions/expenses.actions";

const initialState = {
  expenses: [],
  loading: false,
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
        state.expenses = action.payload;
      });
  },
});
