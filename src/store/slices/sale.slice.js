import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSales, fetchNextSaleNumber } from "../actions/sale.action";

const initialState = {
  sales: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  nextSaleNumber: 0,
};

// async reducers
export const fetchSalesAsync = createAsyncThunk(
  "sales/fetchSales",
  async () => {
    const sales = await fetchSales();
    return sales;
  }
);

// async reducers
export const fetchNextSaleNumberAsync = createAsyncThunk(
  "sales/fetchNextSaleNumber",
  async () => {
    const nextInvoice = await fetchNextSaleNumber();
    return nextInvoice;
  }
);

export const saleSlice = createSlice({
  name: "sales",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action?.payload?.results;
        state.currentPage = action?.payload?.page;
        state.limitPerPage = action?.payload?.limit;
        state.totalPages = action?.payload?.totalPages;
        state.totalRows = action?.payload?.totalResults;
      });

    builder
      .addCase(fetchNextSaleNumberAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNextSaleNumberAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.nextSaleNumber = action.payload.counter;
      });
  },
});
