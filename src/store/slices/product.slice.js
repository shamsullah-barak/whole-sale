import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../actions/product.actions";

const initialState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
};

// async reducers
export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit }) => {
    const products = await fetchProducts(page, limit);
    return products;
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        console.log("product pending state");
        state.loading = true;
      })
      .addCase(fetchProductsAsync.rejected, (state) => {
        console.log({ me: "Request failed" });
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        console.log({
          message: "product fetch state",
          payload: action.payload,
        });
        state.loading = false;
        state.products = action.payload.results;
        state.currentPage = action.payload.page;
        state.limitPerPage = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRows = action.payload.totalResults;
      });
  },
});
