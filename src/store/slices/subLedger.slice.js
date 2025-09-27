import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSubLedgers, createSubLedger, updateSubLedger, deleteSubLedger } from "../actions/subLedger.actions";

const initialState = {
  subLedgers: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  selectedSubLedger: null,
  error: null,
};

// Async thunks
export const fetchSubLedgersAsync = createAsyncThunk(
  "subLedgers/fetchSubLedgers",
  async ({ ledgerId, page, limit }) => {
    const subLedgers = await fetchSubLedgers(ledgerId, page, limit);
    return subLedgers;
  }
);

export const createSubLedgerAsync = createAsyncThunk(
  "subLedgers/createSubLedger",
  async ({ ledgerId, subLedgerData }) => {
    const subLedger = await createSubLedger(ledgerId, subLedgerData);
    return subLedger;
  }
);

export const updateSubLedgerAsync = createAsyncThunk(
  "subLedgers/updateSubLedger",
  async ({ subLedgerId, subLedgerData }) => {
    const subLedger = await updateSubLedger(subLedgerId, subLedgerData);
    return subLedger;
  }
);

export const deleteSubLedgerAsync = createAsyncThunk(
  "subLedgers/deleteSubLedger",
  async (subLedgerId) => {
    await deleteSubLedger(subLedgerId);
    return subLedgerId;
  }
);

export const subLedgerSlice = createSlice({
  name: "subLedgers",
  initialState,
  reducers: {
    setSelectedSubLedger: (state, action) => {
      state.selectedSubLedger = action.payload.subLedger;
    },
    unSetSelectedSubLedger: (state) => {
      state.selectedSubLedger = null;
    },
    clearSubLedgers: (state) => {
      state.subLedgers = [];
      state.selectedSubLedger = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch SubLedgers
      .addCase(fetchSubLedgersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubLedgersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.subLedgers = action.payload.results || action.payload;
        state.currentPage = action.payload.page || 1;
        state.limitPerPage = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
        state.totalRows = action.payload.totalResults || action.payload.length || 0;
      })
      .addCase(fetchSubLedgersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create SubLedger
      .addCase(createSubLedgerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubLedgerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.subLedgers.unshift(action.payload);
        state.totalRows += 1;
      })
      .addCase(createSubLedgerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update SubLedger
      .addCase(updateSubLedgerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubLedgerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subLedgers.findIndex(
          (subLedger) => subLedger._id === action.payload._id
        );
        if (index !== -1) {
          state.subLedgers[index] = action.payload;
        }
      })
      .addCase(updateSubLedgerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete SubLedger
      .addCase(deleteSubLedgerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubLedgerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.subLedgers = state.subLedgers.filter(
          (subLedger) => subLedger._id !== action.payload
        );
        state.totalRows -= 1;
        if (state.selectedSubLedger?._id === action.payload) {
          state.selectedSubLedger = null;
        }
      })
      .addCase(deleteSubLedgerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedSubLedger,
  unSetSelectedSubLedger,
  clearSubLedgers,
  setError,
  clearError,
} = subLedgerSlice.actions;

export default subLedgerSlice.reducer;

