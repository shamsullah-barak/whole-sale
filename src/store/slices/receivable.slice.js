import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchReceivables } from "../actions/receivable.action";

const initialState = {
  receivables: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchReceivablesAsync = createAsyncThunk(
  "receivables/fetchReceivables",
  async () => {
    const receivables = await fetchReceivables();
    return receivables;
  }
);

export const receivablesSlice = createSlice({
  name: "receivables",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivablesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReceivablesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.receivables = action?.payload;
        // state.currentPage = action?.payload?.page;
        // state.limitPerPage = action?.payload?.limit;
        // state.totalPages = action?.payload?.totalPages;
        // state.totalRows = action?.payload?.totalResults;
      });
  },
});
