import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchNextInvoiceNo,
  fetchPurchases,
} from "../actions/purchase.actions";

const initialState = {
  purchases: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  nextInvoiceNo: "",
  totalPurchases: 0,
  totalCashPurchases: 0,
  totalCreditPurchases: 0,
  totalCashAndCreditPurchases: 0,
};

// async reducers
export const fetchPurchasesAsync = createAsyncThunk(
  "purchases/fetchPurchases",
  async ({ page, limit }) => {
    const purchases = await fetchPurchases(page, limit);
    return purchases;
  }
);

// async reducers
export const fetchNextInvoiceAsync = createAsyncThunk(
  "purchases/fetchNextInvoiceNo",
  async () => {
    const nextInvoice = await fetchNextInvoiceNo();
    return nextInvoice;
  }
);

export const purchaseSlice = createSlice({
  name: "purchases",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchasesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchasesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
        state.totalPurchases = action.payload.totalPurchases;
        state.totalCashPurchases = action.payload.totalCashPurchases;
        state.totalCreditPurchases = action.payload.totalCreditPurchases;
        state.totalCashAndCreditPurchases =
          action.payload.totalCashAndCreditPurchases;
      });

    builder
      .addCase(fetchNextInvoiceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNextInvoiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.nextInvoiceNo = action.payload.counter;
      });
  },
});
