import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCustomers,
  fetchSuppliers,
} from "../actions/businessEntity.action";

const initialState = {
  suppliers: {
    suppliers: [],
    currentPage: 1,
    totalPages: 1,
    limitPerPage: 10,
    loading: false,
    totalRows: 0,
  },
  customers: {
    customers: [],
    currentPage: 1,
    totalPages: 1,
    limitPerPage: 10,
    loading: false,
    totalRows: 0,
  },
};

// async reducers
export const fetchSuppliersAsync = createAsyncThunk(
  "businessEntity/fetchSuppliers",
  async ({ page, limit }) => {
    const suppliers = await fetchSuppliers(page, limit);
    return suppliers;
  }
);

// async reducers
export const fetchCustomersAsync = createAsyncThunk(
  "businessEntity/fetchCustomers",
  async ({ page, limit }) => {
    const customers = await fetchCustomers(page, limit);
    return customers;
  }
);

export const businessEntitySlice = createSlice({
  name: "businessEntity",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliersAsync.pending, (state) => {
        state.suppliers.loading = true;
      })
      .addCase(fetchSuppliersAsync.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.suppliers = action.payload.results;
        state.suppliers.currentPage = action.payload.page;
        state.suppliers.limitPerPage = action.payload.limit;
        state.suppliers.totalPages = action.payload.totalPages;
        state.suppliers.totalRows = action.payload.totalResults;
      });
    builder
      .addCase(fetchCustomersAsync.pending, (state) => {
        state.customers.loading = true;
      })
      .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
        state.customers.loading = false;
        state.customers.customers = action.payload.results;
        state.customers.currentPage = action.payload.page;
        state.customers.limitPerPage = action.payload.limit;
        state.customers.totalPages = action.payload.totalPages;
        state.customers.totalRows = action.payload.totalResults;
      });
  },
});
