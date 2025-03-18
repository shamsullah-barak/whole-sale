import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPurchases } from "../actions/purchase.actions";

const initialState = {
  purchases: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchPurchasesAsync = createAsyncThunk(
  "purchases/fetchPurchases",
  async ({ page, limit }) => {
    const purchases = await fetchPurchases(page, limit);
    return purchases;
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
      });
  },
});
