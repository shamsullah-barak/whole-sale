import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStockItems } from "../actions/stock.items.actions";

const initialState = {
  stockItems: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchStockItemsAsync = createAsyncThunk(
  "stockItems/fetchStockItems",
  async ({ id, page, limit }) => {
    const stockItems = await fetchStockItems(id, page, limit);
    return stockItems;
  }
);

export const stockItemsSlice = createSlice({
  name: "stockItems",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchStockItemsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockItemsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.stockItems = action.payload;
        // state.currentPage = action.payload.page;
        // state.limitPerPage = action.payload.limit;
        // state.totalPages = action.payload.totalPages;
        // state.totalRows = action.payload.totalResults;
      });
  },
});
