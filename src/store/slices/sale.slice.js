import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchSales,
  createSale,
  updateSale,
  deleteSale,
  fetchNextSaleNumber,
} from "../actions/sale.action";

const initialState = {
  sales: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  nextSaleNumber: 0,
  selectedSale: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

// async reducers
export const fetchSalesAsync = createAsyncThunk(
  "sales/fetchSales",
  async ({ page, limit }) => {
    const sales = await fetchSales(page, limit);
    return sales;
  }
);

export const createSaleAsync = createAsyncThunk(
  "sales/createSale",
  async (saleData) => {
    const newSale = await createSale(saleData);
    return newSale;
  }
);

export const updateSaleAsync = createAsyncThunk(
  "sales/updateSale",
  async ({ saleId, saleData }) => {
    const updatedSale = await updateSale(saleId, saleData);
    return updatedSale;
  }
);

export const deleteSaleAsync = createAsyncThunk(
  "sales/deleteSale",
  async (saleId) => {
    await deleteSale(saleId);
    return saleId;
  }
);

export const fetchNextSaleNumberAsync = createAsyncThunk(
  "sales/fetchNextSaleNumber",
  async () => {
    const nextInvoice = await fetchNextSaleNumber();
    return nextInvoice;
  }
);

export const saleSlice = createSlice({
  name: "sales",
  initialState,

  reducers: {
    setSelectedSale: (state, action) => {
      state.selectedSale = action.payload;
    },
    clearSelectedSale: (state) => {
      state.selectedSale = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Sales
      .addCase(fetchSalesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action?.payload?.results || action?.payload;
        state.currentPage = action?.payload?.page || 1;
        state.limitPerPage = action?.payload?.limit || 10;
        state.totalPages = action?.payload?.totalPages || 1;
        state.totalRows = action?.payload?.totalResults || 0;
      })
      .addCase(fetchSalesAsync.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createSaleAsync.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createSaleAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.sales.unshift(action.payload);
      })
      .addCase(createSaleAsync.rejected, (state) => {
        state.createLoading = false;
      })

      // Update Sale
      .addCase(updateSaleAsync.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateSaleAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.sales.findIndex(
          (sale) => sale._id === action.payload._id
        );
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (
          state.selectedSale &&
          state.selectedSale._id === action.payload._id
        ) {
          state.selectedSale = action.payload;
        }
      })
      .addCase(updateSaleAsync.rejected, (state) => {
        state.updateLoading = false;
      })

      // Delete Sale
      .addCase(deleteSaleAsync.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteSaleAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.sales = state.sales.filter((sale) => sale._id !== action.payload);
        if (state.selectedSale && state.selectedSale._id === action.payload) {
          state.selectedSale = null;
        }
      })
      .addCase(deleteSaleAsync.rejected, (state) => {
        state.deleteLoading = false;
      })

      // Fetch Next Sale Number
      .addCase(fetchNextSaleNumberAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNextSaleNumberAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.nextSaleNumber = action.payload.counter;
      })
      .addCase(fetchNextSaleNumberAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedSale, clearSelectedSale } = saleSlice.actions;
