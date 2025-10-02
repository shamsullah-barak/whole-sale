import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchExpenses,
  fetchExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchNextExpenseNumber,
} from "../actions/expenses.actions";

const initialState = {
  expenses: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  nextExpenseNumber: 0,
  selectedExpense: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

// async reducers
export const fetchExpensesAsync = createAsyncThunk(
  "expenses/fetchExpenses",
  async ({ page, limit }) => {
    const expenses = await fetchExpenses(page, limit);
    return expenses;
  }
);

export const fetchExpenseByIdAsync = createAsyncThunk(
  "expenses/fetchExpenseById",
  async (expenseId) => {
    const expense = await fetchExpenseById(expenseId);
    return expense;
  }
);

export const createExpenseAsync = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData) => {
    const newExpense = await createExpense(expenseData);
    return newExpense;
  }
);

export const updateExpenseAsync = createAsyncThunk(
  "expenses/updateExpense",
  async ({ expenseId, expenseData }) => {
    const updatedExpense = await updateExpense(expenseId, expenseData);
    return updatedExpense;
  }
);

export const deleteExpenseAsync = createAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId) => {
    await deleteExpense(expenseId);
    return expenseId;
  }
);

export const fetchNextExpenseNumberAsync = createAsyncThunk(
  "expenses/fetchNextExpenseNumber",
  async () => {
    const nextInvoice = await fetchNextExpenseNumber();
    return nextInvoice;
  }
);

export const expenseSlice = createSlice({
  name: "expenses",
  initialState,

  reducers: {
    setSelectedExpense: (state, action) => {
      state.selectedExpense = action.payload;
    },
    clearSelectedExpense: (state) => {
      state.selectedExpense = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpensesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpensesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action?.payload?.results || action?.payload;
        state.currentPage = action?.payload?.page || 1;
        state.limitPerPage = action?.payload?.limit || 10;
        state.totalPages = action?.payload?.totalPages || 1;
        state.totalRows = action?.payload?.totalResults || 0;
      })
      .addCase(fetchExpensesAsync.rejected, (state) => {
        state.loading = false;
      })

      // Fetch Expense by ID
      .addCase(fetchExpenseByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenseByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload;
      })
      .addCase(fetchExpenseByIdAsync.rejected, (state) => {
        state.loading = false;
      })

      // Create Expense
      .addCase(createExpenseAsync.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createExpenseAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpenseAsync.rejected, (state) => {
        state.createLoading = false;
      })

      // Update Expense
      .addCase(updateExpenseAsync.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateExpenseAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.expenses.findIndex(
          (expense) => expense._id === action.payload._id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        if (
          state.selectedExpense &&
          state.selectedExpense._id === action.payload._id
        ) {
          state.selectedExpense = action.payload;
        }
      })
      .addCase(updateExpenseAsync.rejected, (state) => {
        state.updateLoading = false;
      })

      // Delete Expense
      .addCase(deleteExpenseAsync.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.expenses = state.expenses.filter(
          (expense) => expense._id !== action.payload
        );
        if (
          state.selectedExpense &&
          state.selectedExpense._id === action.payload
        ) {
          state.selectedExpense = null;
        }
      })
      .addCase(deleteExpenseAsync.rejected, (state) => {
        state.deleteLoading = false;
      })

      // Fetch Next Expense Number
      .addCase(fetchNextExpenseNumberAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNextExpenseNumberAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.nextExpenseNumber = action.payload.counter;
      })
      .addCase(fetchNextExpenseNumberAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedExpense, clearSelectedExpense } =
  expenseSlice.actions;
