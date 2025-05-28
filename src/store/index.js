import { configureStore } from "@reduxjs/toolkit";
import ledgersSlice from "./reducers/ledgers.reducer";
import productReducer from "./reducers/product.reducer";
import purchaseSlice from "./reducers/purchase.reducer";
import journalSlice from "./reducers/journal.reducer";
import appSlice from "./reducers/app.reducer";
import transactionTypesSlice from "./reducers/transaction.types.reducer";
import ledgerTransactionsSlice from "./reducers/ledger.transactions.reducer";
import stockSlice from "./reducers/stock.reducer";

export const store = configureStore({
  reducer: {
    app: appSlice,
    stocks: stockSlice,
    ledgers: ledgersSlice,
    products: productReducer,
    purchases: purchaseSlice,
    journals: journalSlice,
    transactionTypes: transactionTypesSlice,
    ledgerTransactions: ledgerTransactionsSlice,
  },
});
