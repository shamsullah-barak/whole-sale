import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardData,
  fetchNextInvoiceNo,
  fetchPurchases,
  createPurchase,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} from "../actions/purchase.actions";

const initialState = {
  purchases: [],
  currentPurchase: null,
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  nextInvoiceNo: "",
  totalPurchases: 0,
  totalCashPurchases: 0,
  totalCreditPurchases: 0,
  totalCashAndCreditPurchases: 0,
  dashboardData: {},
  error: null,
};

// async reducers
export const fetchPurchasesAsync = createAsyncThunk(
  "purchases/fetchPurchases",
  async ({ page, limit }) => {
    const purchases = await fetchPurchases(page, limit);
    return purchases;
  }
);

// async reducers
export const fetchNextInvoiceAsync = createAsyncThunk(
  "purchases/fetchNextInvoiceNo",
  async () => {
    const nextInvoice = await fetchNextInvoiceNo();
    return nextInvoice;
  }
);

// async reducers
export const fetchDashboardDataAsync = createAsyncThunk(
  "purchases/fetchDashboardData",
  async () => {
    const result = await fetchDashboardData();
    return result;
  }
);

// CRUD thunks
export const createPurchaseAsync = createAsyncThunk(
  "purchases/create",
  async (data, { rejectWithValue }) => {
    try {
      const result = await createPurchase(data);
      return result;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Create failed" });
    }
  }
);

export const getPurchaseByIdAsync = createAsyncThunk(
  "purchases/getById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await getPurchaseById(id);
      return result;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Fetch failed" });
    }
  }
);

export const updatePurchaseAsync = createAsyncThunk(
  "purchases/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await updatePurchase(id, data);
      return result;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Update failed" });
    }
  }
);

export const deletePurchaseAsync = createAsyncThunk(
  "purchases/delete",
  async (id, { rejectWithValue }) => {
    try {
      const result = await deletePurchase(id);
      return { id, result };
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Delete failed" });
    }
  }
);

export const purchaseSlice = createSlice({
  name: "purchases",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchasesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchasesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
        state.totalPurchases = action.payload.totalPurchases;
        state.totalCashPurchases = action.payload.totalCashPurchases;
        state.totalCreditPurchases = action.payload.totalCreditPurchases;
        state.totalCashAndCreditPurchases =
          action.payload.totalCashAndCreditPurchases;
      })
      .addCase(fetchPurchasesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });

    builder
      .addCase(fetchNextInvoiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextInvoiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.nextInvoiceNo = action.payload.counter;
      })
      .addCase(fetchNextInvoiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });

    builder
      .addCase(fetchDashboardDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });

    // Create
    builder
      .addCase(createPurchaseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = [action.payload, ...state.purchases];
        state.totalRows += 1;
      })
      .addCase(createPurchaseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });

    // Get by id
    builder
      .addCase(getPurchaseByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPurchase = null;
      })
      .addCase(getPurchaseByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPurchase = action.payload;
      })
      .addCase(getPurchaseByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });

    // Update
    builder
      .addCase(updatePurchaseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.purchases = state.purchases.map((p) =>
          p._id === updated._id ? updated : p
        );
        if (state.currentPurchase && state.currentPurchase._id === updated._id) {
          state.currentPurchase = updated;
        }
      })
      .addCase(updatePurchaseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });

    // Delete
    builder
      .addCase(deletePurchaseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchaseAsync.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.purchases = state.purchases.filter((p) => p._id !== deletedId);
        state.totalRows = Math.max(0, state.totalRows - 1);
      })
      .addCase(deletePurchaseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  },
});
