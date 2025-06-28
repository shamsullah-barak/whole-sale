import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPartners } from "../actions/investment.action";

const initialState = {
  partners: [],
  loading: false,
};

// async reducers
export const fetchPartnersAsync = createAsyncThunk(
  "partners/fetchPartners",
  async () => {
    const partners = await fetchPartners();
    return partners;
  }
);

export const investmentsSlice = createSlice({
  name: "partners",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPartnersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      });
  },
});
