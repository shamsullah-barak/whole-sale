import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
  fetchInstallments, 
  fetchInstallmentById, 
  createInstallment, 
  updateInstallment, 
  deleteInstallment,
  fetchLoans,
  fetchInstallmentHistory
} from "../actions/installment.action";

const initialState = {
  installments: [],
  loans: [],
  installmentHistory: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  selectedInstallment: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  loansLoading: false,
  historyLoading: false,
};

// async reducers
export const fetchInstallmentsAsync = createAsyncThunk(
  "installments/fetchInstallments",
  async ({ page, limit, type }) => {
    const installments = await fetchInstallments(page, limit, type);
    return installments;
  }
);

export const fetchInstallmentByIdAsync = createAsyncThunk(
  "installments/fetchInstallmentById",
  async (installmentId) => {
    const installment = await fetchInstallmentById(installmentId);
    return installment;
  }
);

export const createInstallmentAsync = createAsyncThunk(
  "installments/createInstallment",
  async (installmentData) => {
    const newInstallment = await createInstallment(installmentData);
    return newInstallment;
  }
);

export const updateInstallmentAsync = createAsyncThunk(
  "installments/updateInstallment",
  async ({ installmentId, installmentData }) => {
    const updatedInstallment = await updateInstallment(installmentId, installmentData);
    return updatedInstallment;
  }
);

export const deleteInstallmentAsync = createAsyncThunk(
  "installments/deleteInstallment",
  async (installmentId) => {
    await deleteInstallment(installmentId);
    return installmentId;
  }
);

export const fetchLoansAsync = createAsyncThunk(
  "installments/fetchLoans",
  async (type) => {
    const loans = await fetchLoans(type);
    return loans;
  }
);

export const fetchInstallmentHistoryAsync = createAsyncThunk(
  "installments/fetchInstallmentHistory",
  async (loanId) => {
    const history = await fetchInstallmentHistory(loanId);
    return history;
  }
);

export const installmentSlice = createSlice({
  name: "installments",
  initialState,

  reducers: {
    setSelectedInstallment: (state, action) => {
      state.selectedInstallment = action.payload;
    },
    clearSelectedInstallment: (state) => {
      state.selectedInstallment = null;
    },
    clearInstallmentHistory: (state) => {
      state.installmentHistory = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Installments
      .addCase(fetchInstallmentsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstallmentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.installments = action?.payload?.results || action?.payload;
        state.currentPage = action?.payload?.page || 1;
        state.limitPerPage = action?.payload?.limit || 10;
        state.totalPages = action?.payload?.totalPages || 1;
        state.totalRows = action?.payload?.totalResults || 0;
      })
      .addCase(fetchInstallmentsAsync.rejected, (state) => {
        state.loading = false;
      })

      // Fetch Installment by ID
      .addCase(fetchInstallmentByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstallmentByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInstallment = action.payload;
      })
      .addCase(fetchInstallmentByIdAsync.rejected, (state) => {
        state.loading = false;
      })

      // Create Installment
      .addCase(createInstallmentAsync.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createInstallmentAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.installments.unshift(action.payload);
      })
      .addCase(createInstallmentAsync.rejected, (state) => {
        state.createLoading = false;
      })

      // Update Installment
      .addCase(updateInstallmentAsync.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateInstallmentAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.installments.findIndex(installment => installment._id === action.payload._id);
        if (index !== -1) {
          state.installments[index] = action.payload;
        }
        if (state.selectedInstallment && state.selectedInstallment._id === action.payload._id) {
          state.selectedInstallment = action.payload;
        }
      })
      .addCase(updateInstallmentAsync.rejected, (state) => {
        state.updateLoading = false;
      })

      // Delete Installment
      .addCase(deleteInstallmentAsync.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteInstallmentAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.installments = state.installments.filter(installment => installment._id !== action.payload);
        if (state.selectedInstallment && state.selectedInstallment._id === action.payload) {
          state.selectedInstallment = null;
        }
      })
      .addCase(deleteInstallmentAsync.rejected, (state) => {
        state.deleteLoading = false;
      })

      // Fetch Loans
      .addCase(fetchLoansAsync.pending, (state) => {
        state.loansLoading = true;
      })
      .addCase(fetchLoansAsync.fulfilled, (state, action) => {
        state.loansLoading = false;
        state.loans = action.payload;
      })
      .addCase(fetchLoansAsync.rejected, (state) => {
        state.loansLoading = false;
      })

      // Fetch Installment History
      .addCase(fetchInstallmentHistoryAsync.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(fetchInstallmentHistoryAsync.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.installmentHistory = action.payload;
      })
      .addCase(fetchInstallmentHistoryAsync.rejected, (state) => {
        state.historyLoading = false;
      });
  },
});

export const { setSelectedInstallment, clearSelectedInstallment, clearInstallmentHistory } = installmentSlice.actions;
