import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  fetchCompanies,
  fetchCategories,
} from '../actions/product.actions';

const initialState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  selectedProduct: null,
  companies: [],
  categories: [],
  error: null,
  filters: {},
};

// Async thunks
export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit, filters = {} }, { rejectWithValue }) => {
    try {
      const products = await fetchProducts(page, limit, filters);
      return products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProductAsync = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const product = await createProduct(productData);
    return product;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProductAsync = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const product = await updateProduct(productId, productData);
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProductAsync = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    await deleteProduct(productId);
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

export const getProductByIdAsync = createAsyncThunk('products/getProductById', async (productId, { rejectWithValue }) => {
  try {
    const product = await getProductById(productId);
    return product;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
  }
});

export const fetchCompaniesAsync = createAsyncThunk('products/fetchCompanies', async (_, { rejectWithValue }) => {
  try {
    const companies = await fetchCompanies();
    return companies;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch companies');
  }
});

export const fetchCategoriesAsync = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const categories = await fetchCategories();
    return categories;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
  }
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload.results || action.payload.data || [];
        state.currentPage = action.payload.page || 1;
        state.limitPerPage = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
        state.totalRows = action.payload.totalResults || 0;
      })
      // Create product
      .addCase(createProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products.unshift(action.payload);
        state.totalRows += 1;
      })
      // Update product
      .addCase(updateProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.selectedProduct = action.payload;
      })
      // Delete product
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.totalRows -= 1;
      })
      // Get product by ID
      .addCase(getProductByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedProduct = action.payload;
      })
      // Fetch companies
      .addCase(fetchCompaniesAsync.fulfilled, (state, action) => {
        state.companies = action.payload.results || action.payload.data || [];
      })
      // Fetch categories
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload.results || action.payload.data || [];
      });
  },
});

export const { setFilters, clearError, clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
