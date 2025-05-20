import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTransactionTypes } from "../actions/transaction.types.actions";

const initialState = {
  transactionTypes: [],
};

// async reducers
export const fetchTransactionTypesAsync = createAsyncThunk(
  "transactionTypes/fetchTransactionTypes",
  async () => {
    const transactionTypes = await fetchTransactionTypes();
    return transactionTypes;
  }
);

export const transactionTypesSlice = createSlice({
  name: "transactionTypes",
  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchTransactionTypesAsync.fulfilled, (state, action) => {
      state.transactionTypes = action.payload;
    });
  },
});
