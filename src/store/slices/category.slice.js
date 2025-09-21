import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
} from "../actions/category.actions";

const initialState = {
  categories: [],
  allCategories: [], // For dropdowns
  currentPage: 1,
  totalPages: 1,
  limitPerPage: 10,
  loading: false,
  totalRows: 0,
  selectedCategory: null,
  error: null,
  filters: {},
};

// Async thunks
export const fetchCategoriesAsync = createAsyncThunk(
  "categories/fetchCategories",
  async ({ page, limit, filters = {} }, { rejectWithValue }) => {
    try {
      const categories = await fetchCategories(page, limit, filters);
      return categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const createCategoryAsync = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const category = await createCategory(categoryData);
      return category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const category = await updateCategory(categoryId, categoryData);
      return category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

export const getCategoryByIdAsync = createAsyncThunk(
  "categories/getCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const category = await getCategoryById(categoryId);
      return category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }
);

export const getAllCategoriesAsync = createAsyncThunk(
  "categories/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await getAllCategories();
      return categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all categories"
      );
    }
  }
);

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categories = action.payload.results || action.payload.data || [];
        state.currentPage = action.payload.page || 1;
        state.limitPerPage = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
        state.totalRows = action.payload.totalResults || 0;
      })
      // Create category
      .addCase(createCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categories.unshift(action.payload);
        state.totalRows += 1;
      })
      // Update category
      .addCase(updateCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.selectedCategory = action.payload;
      })
      // Delete category
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload
        );
        state.totalRows -= 1;
      })
      // Get category by ID
      .addCase(getCategoryByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCategoryByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedCategory = action.payload;
      })
      // Get all categories
      .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
        state.allCategories =
          action.payload.results || action.payload.data || [];
      });
  },
});

export const { setFilters, clearError, clearSelectedCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
