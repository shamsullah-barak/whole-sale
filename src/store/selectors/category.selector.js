// Select all categories state
export const selectCategories = (state) => state.categories;

// Select individual properties
export const selectCategoriesList = (state) => state.categories.categories;
export const selectAllCategories = (state) => state.categories.allCategories;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectSelectedCategory = (state) => state.categories.selectedCategory;
export const selectCategoriesFilters = (state) => state.categories.filters;
export const selectCategoriesPagination = (state) => ({
  currentPage: state.categories.currentPage,
  totalPages: state.categories.totalPages,
  limitPerPage: state.categories.limitPerPage,
  totalRows: state.categories.totalRows,
});
