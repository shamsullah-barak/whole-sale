import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLedgerTransactions } from "../actions/ledger.transactions.actions";

const initialState = {
  ledgerTransactions: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  selectedLedger: null,
};

// async reducers
export const fetchLedgerTransactionsAsync = createAsyncThunk(
  "ledgerTransactions/fetchLedgerTransactions",
  async ({ relatedTo, page, limit }) => {
    const ledgerTransactions = await fetchLedgerTransactions({
      relatedTo,
      page,
      limit,
    });
    return ledgerTransactions;
  }
);

export const ledgerTransactionsSlice = createSlice({
  name: "ledgerTransactions",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchLedgerTransactionsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLedgerTransactionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ledgerTransactions = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });
  },
});
