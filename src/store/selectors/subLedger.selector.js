import { createSelector } from "@reduxjs/toolkit";

const selectSubLedgerState = (state) => state.subLedgers;

export const selectSubLedgers = createSelector(
  [selectSubLedgerState],
  (subLedgerState) => subLedgerState
);

export const selectSubLedgersList = createSelector(
  [selectSubLedgerState],
  (subLedgerState) => subLedgerState.subLedgers
);

export const selectSelectedSubLedger = createSelector(
  [selectSubLedgerState],
  (subLedgerState) => subLedgerState.selectedSubLedger
);

export const selectSubLedgerLoading = createSelector(
  [selectSubLedgerState],
  (subLedgerState) => subLedgerState.loading
);

export const selectSubLedgerError = createSelector(
  [selectSubLedgerState],
  (subLedgerState) => subLedgerState.error
);

export const selectSubLedgerPagination = createSelector(
  [selectSubLedgerState],
  (subLedgerState) => ({
    currentPage: subLedgerState.currentPage,
    totalPages: subLedgerState.totalPages,
    limitPerPage: subLedgerState.limitPerPage,
    totalRows: subLedgerState.totalRows,
  })
);

