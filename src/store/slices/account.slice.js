import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAccounts } from "../actions/account.actions";

const initialState = {
  accounts: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchAccountsAsync = createAsyncThunk(
  "accounts/fetchAccounts",
  async ({ page, limit }) => {
    const accounts = await fetchAccounts(page, limit);
    return accounts;
  }
);

export const accountSlice = createSlice({
  name: "accounts",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });
  },
});
