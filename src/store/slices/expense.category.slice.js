import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchExpenseCategories } from "../actions/expenses.category.action";

const initialState = {
  expenseCategories: [],
  loading: false,
};

// async reducers
export const fetchExpenseCategoriesAsync = createAsyncThunk(
  "expenses/fetchExpensesCategories",
  async () => {
    const expenses = await fetchExpenseCategories();
    return expenses;
  }
);

export const expenseCategorySlice = createSlice({
  name: "expenseCategories",
  initialState,

  reducers: {
    addExpenseCategory: (state, action) => {
      state.selectedExpense = [
        ...state.expenseCategories,
        action.payload.expenseCategory,
      ];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseCategoriesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenseCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseCategories = action?.payload;
      })
      .addCase(fetchExpenseCategoriesAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addExpenseCategory } = expenseCategorySlice.actions;
