// select all installments
export const selectInstallments = (state) => state.installments;

// select installments array
export const selectInstallmentsList = (state) => state.installments.installments;

// select selected installment
export const selectSelectedInstallment = (state) => state.installments.selectedInstallment;

// select loans
export const selectLoans = (state) => state.installments.loans;

// select installment history
export const selectInstallmentHistory = (state) => state.installments.installmentHistory;

// select loading states
export const selectInstallmentsLoading = (state) => state.installments.loading;
export const selectCreateInstallmentLoading = (state) => state.installments.createLoading;
export const selectUpdateInstallmentLoading = (state) => state.installments.updateLoading;
export const selectDeleteInstallmentLoading = (state) => state.installments.deleteLoading;
export const selectLoansLoading = (state) => state.installments.loansLoading;
export const selectHistoryLoading = (state) => state.installments.historyLoading;

// select pagination info
export const selectInstallmentsPagination = (state) => ({
  currentPage: state.installments.currentPage,
  totalPages: state.installments.totalPages,
  limitPerPage: state.installments.limitPerPage,
  totalRows: state.installments.totalRows,
});

// select loans by type
export const selectLoansByType = (type) => (state) => 
  state.installments.loans.filter(loan => loan.type === type);

// select payable loans (AP)
export const selectPayableLoans = (state) => 
  state.installments.loans.filter(loan => loan.type === "AP");

// select receivable loans (AR)
export const selectReceivableLoans = (state) => 
  state.installments.loans.filter(loan => loan.type === "AR");
