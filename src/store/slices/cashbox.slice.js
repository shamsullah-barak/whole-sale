import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCashboxBalances } from "../actions/cashbox.actions";

const initialState = {
  loading: false,
  error: null,
  balances: [],
};

export const fetchCashboxBalancesAsync = createAsyncThunk(
  "cashbox/fetchBalances",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCashboxBalances();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cashbox balances"
      );
    }
  }
);

export const cashboxSlice = createSlice({
  name: "cashbox",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCashboxBalancesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCashboxBalancesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(fetchCashboxBalancesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.balances = action.payload;
      });
  },
});

export default cashboxSlice.reducer;
