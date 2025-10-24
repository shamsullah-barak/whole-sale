// select all sales
export const selectSales = (state) => state.sales;

// select sales array
export const selectSalesList = (state) => state.sales.sales;

// select selected sale
export const selectSelectedSale = (state) => state.sales.selectedSale;

// select next sale number
export const selectNextSaleNumber = (state) => state.sales.nextSaleNumber;

// select loading states
export const selectSalesLoading = (state) => state.sales.loading;
export const selectCreateSaleLoading = (state) => state.sales.createLoading;
export const selectUpdateSaleLoading = (state) => state.sales.updateLoading;
export const selectDeleteSaleLoading = (state) => state.sales.deleteLoading;

// select pagination info
export const selectSalesPagination = (state) => ({
  currentPage: state.sales.currentPage,
  totalPages: state.sales.totalPages,
  limitPerPage: state.sales.limitPerPage,
  totalRows: state.sales.totalRows,
});
