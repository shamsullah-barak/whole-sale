import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchStockNames,
  fetchStocks,
  deleteStock,
  updateStock,
} from "../actions/stock.actions";

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
  async () => {
    const stocks = await fetchStocks();
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

// Delete stock async thunk
export const deleteStockAsync = createAsyncThunk(
  "stocks/deleteStock",
  async (stockId) => {
    const result = await deleteStock(stockId);
    return { stockId, result };
  }
);

// Update stock async thunk
export const updateStockAsync = createAsyncThunk(
  "stocks/updateStock",
  async ({ stockId, payload }) => {
    const updated = await updateStock(stockId, payload);
    return updated;
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
    removeStockFromList: (state, action) => {
      state.stocks = state.stocks.filter(
        (stock) => stock._id !== action.payload
      );
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

    builder
      .addCase(deleteStockAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStockAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = state.stocks.filter(
          (stock) => stock._id !== action.payload.stockId
        );
      })
      .addCase(deleteStockAsync.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateStockAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStockAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.stocks = state.stocks.map((s) =>
          s._id === updated._id ? { ...s, ...updated } : s
        );
      })
      .addCase(updateStockAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addStockToList, removeStockFromList } = stockSlice.actions;
