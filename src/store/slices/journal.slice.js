import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchJournals } from "../actions/journal.actions";

const initialState = {
  journals: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchJournalsAsync = createAsyncThunk(
  "journals/fetchJournals",
  async ({ page, limit }) => {
    const journals = await fetchJournals(page, limit);
    return journals;
  }
);

export const journalSlice = createSlice({
  name: "journals",
  initialState,

  reducers: {
    addItemToJournals: (state, action) => {
      const arr = [...state.journals];
      arr.push(action.payload.item);
      state.journals = [...arr];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchJournalsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJournalsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.journals = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });
  },
});

export const { addItemToJournals, unSetSelectedAccount } = journalSlice.actions;
