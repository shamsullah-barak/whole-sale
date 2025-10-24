import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyById,
  getAllCompanies,
} from "../actions/company.actions";

const initialState = {
  companies: [],
  allCompanies: [], // For dropdowns
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  selectedCompany: null,
  error: null,
  filters: {},
};

// Async thunks
export const fetchCompaniesAsync = createAsyncThunk(
  "companies/fetchCompanies",
  async () => {
    try {
      const companies = await fetchCompanies();
      return companies;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const createCompanyAsync = createAsyncThunk(
  "companies/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const company = await createCompany(companyData);
      return company;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create company"
      );
    }
  }
);

export const updateCompanyAsync = createAsyncThunk(
  "companies/updateCompany",
  async ({ companyId, companyData }, { rejectWithValue }) => {
    try {
      const company = await updateCompany(companyId, companyData);
      return company;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update company"
      );
    }
  }
);

export const deleteCompanyAsync = createAsyncThunk(
  "companies/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      await deleteCompany(companyId);
      return companyId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete company"
      );
    }
  }
);

export const getCompanyByIdAsync = createAsyncThunk(
  "companies/getCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const company = await getCompanyById(companyId);
      return company;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company"
      );
    }
  }
);

export const getAllCompaniesAsync = createAsyncThunk(
  "companies/getAllCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const companies = await getAllCompanies();
      return companies;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all companies"
      );
    }
  }
);

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies
      .addCase(fetchCompaniesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompaniesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.companies = action.payload.results || action.payload.data || [];
        state.currentPage = action.payload.page || 1;
        state.limitPerPage = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
        state.totalRows = action.payload.totalResults || 0;
      })
      // Create company
      .addCase(createCompanyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCompanyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.companies.unshift(action.payload);
        state.totalRows += 1;
      })
      // Update company
      .addCase(updateCompanyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompanyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.companies.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        state.selectedCompany = action.payload;
      })
      // Delete company
      .addCase(deleteCompanyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompanyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCompanyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.companies = state.companies.filter(
          (c) => c.id !== action.payload
        );
        state.totalRows -= 1;
      })
      // Get company by ID
      .addCase(getCompanyByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCompanyByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedCompany = action.payload;
      })
      // Get all companies
      .addCase(getAllCompaniesAsync.fulfilled, (state, action) => {
        state.allCompanies =
          action.payload.results || action.payload.data || [];
      });
  },
});

export const { setFilters, clearError, clearSelectedCompany } =
  companySlice.actions;

export default companySlice.reducer;
