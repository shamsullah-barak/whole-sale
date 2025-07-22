import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLedgers } from "../actions/ledger.actions";

const initialState = {
  ledgers: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  selectedLedger: null,
};

// async reducers
export const fetchLedgersAsync = createAsyncThunk(
  "ledgers/fetchLedgers",
  async ({ page, limit }) => {
    const ledgers = await fetchLedgers(page, limit);
    return ledgers;
  }
);

// export const fetchCashBoxAsync = createAsyncThunk(
//   "ledgers/fetchCashBox",
//   async () => {
//     const cashBox = await fetchCashBox();
//     return cashBox;
//   }
// );

export const ledgersSlice = createSlice({
  name: "ledgers",
  initialState,

  reducers: {
    setSelectedLedger: (state, action) => {
      state.selectedLedger = action.payload.ledger;
    },
    unSetSelectedLedger: (state, action) => {
      state.selectedLedger = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLedgersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLedgersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ledgers = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });

    // builder.addCase(fetchCashBoxAsync.fulfilled, (state, action) => {
    //   state.cashBox = action.payload.balance;
    // });
  },
});

export const { setSelectedLedger, unSetSelectedLedger } = ledgersSlice.actions;
