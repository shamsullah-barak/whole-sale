// select all expenses
export const selectExpenses = (state) => state.expenses;

// select expenses array
export const selectExpensesList = (state) => state.expenses.expenses;

// select selected expense
export const selectSelectedExpense = (state) => state.expenses.selectedExpense;

// select next expense number
export const selectNextExpenseNumber = (state) =>
  state.expenses.nextExpenseNumber;

// select loading states
export const selectExpensesLoading = (state) => state.expenses.loading;
export const selectCreateExpenseLoading = (state) =>
  state.expenses.createLoading;
export const selectUpdateExpenseLoading = (state) =>
  state.expenses.updateLoading;
export const selectDeleteExpenseLoading = (state) =>
  state.expenses.deleteLoading;

// select pagination info
export const selectExpensesPagination = (state) => ({
  currentPage: state.expenses.currentPage,
  totalPages: state.expenses.totalPages,
  limitPerPage: state.expenses.limitPerPage,
  totalRows: state.expenses.totalRows,
});
