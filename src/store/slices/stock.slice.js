import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStocks } from "../actions/stock.actions";

const initialState = {
  stocks: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchStocksAsync = createAsyncThunk(
  "stocks/fetchStocks",
  async ({ page, limit }) => {
    const stocks = await fetchStocks(page, limit);
    return stocks;
  }
);

export const stockSlice = createSlice({
  name: "stocks",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchStocksAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });
  },
});
