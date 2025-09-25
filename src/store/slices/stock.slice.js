import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchStockNames, fetchStocks } from "../actions/stock.actions";

const initialState = {
  stocks: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  stockNames: [],
};

// async reducers
export const fetchStocksAsync = createAsyncThunk(
  "stocks/fetchStocks",
  async ({ page, limit }) => {
    const stocks = await fetchStocks(page, limit);
    return stocks;
  }
);

// async reducers
export const fetchStockNamesAsync = createAsyncThunk(
  "stockNames/fetchStockNames",
  async () => {
    const stockNames = await fetchStockNames();
    return stockNames;
  }
);

export const stockSlice = createSlice({
  name: "stocks",
  initialState,

  reducers: {
    addStockToList: (state, action) => {
      const arr = [...state.stocks, action.payload.stock];
      state.stocks = [...arr];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStocksAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      });

    builder
      .addCase(fetchStockNamesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockNamesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.stockNames = action.payload;
      });
  },
});

export const { addStockToList } = stockSlice.actions;
