import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPayable } from "../actions/payable.action";

const initialState = {
  payable: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchPayableAsync = createAsyncThunk(
  "payable/fetchPayable",
  async () => {
    const payable = await fetchPayable();
    return payable;
  }
);

export const payableSlice = createSlice({
  name: "payable",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchPayableAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayableAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.payable = action?.payload?.results;
        state.currentPage = action?.payload?.page;
        state.limitPerPage = action?.payload?.limit;
        state.totalPages = action?.payload?.totalPages;
        state.totalRows = action?.payload?.totalResults;
      });
  },
});
