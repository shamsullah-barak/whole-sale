// Select all companies state
export const selectCompanies = (state) => state.companies;

// Select individual properties
export const selectCompaniesList = (state) => state.companies.companies;
export const selectAllCompanies = (state) => state.companies.allCompanies;
export const selectCompaniesLoading = (state) => state.companies.loading;
export const selectCompaniesError = (state) => state.companies.error;
export const selectSelectedCompany = (state) => state.companies.selectedCompany;
export const selectCompaniesFilters = (state) => state.companies.filters;
export const selectCompaniesPagination = (state) => ({
  currentPage: state.companies.currentPage,
  totalPages: state.companies.totalPages,
  limitPerPage: state.companies.limitPerPage,
  totalRows: state.companies.totalRows,
});
