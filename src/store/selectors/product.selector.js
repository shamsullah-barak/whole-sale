// Select all products state
export const selectProducts = (state) => state.products;

// Select individual properties
export const selectProductsList = (state) => state.products.products;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectCompanies = (state) => state.products.companies;
export const selectCategories = (state) => state.products.categories;
export const selectProductsFilters = (state) => state.products.filters;
export const selectProductsPagination = (state) => ({
  currentPage: state.products.currentPage,
  totalPages: state.products.totalPages,
  limitPerPage: state.products.limitPerPage,
  totalRows: state.products.totalRows,
});
