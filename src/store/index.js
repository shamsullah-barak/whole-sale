import { configureStore } from '@reduxjs/toolkit';
import ledgersSlice from './reducers/ledgers.reducer';
import productReducer from './reducers/product.reducer';
import purchaseSlice from './reducers/purchase.reducer';
import journalSlice from './reducers/journal.reducer';
import appSlice from './reducers/app.reducer';
import transactionTypesSlice from './reducers/transaction.types.reducer';
import ledgerTransactionsSlice from './reducers/ledger.transactions.reducer';
import stockSlice from './reducers/stock.reducer';
import stockItemsSlice from './reducers/stock.items.reducer';
import categorySlice from './reducers/category.reducer';
import companySlice from './reducers/company.reducer';
import unitReducer from './reducers/unit.slice';

export const store = configureStore({
  reducer: {
    app: appSlice,
    stocks: stockSlice,
    stockItems: stockItemsSlice,
    ledgers: ledgersSlice,
    products: productReducer,
    purchases: purchaseSlice,
    journals: journalSlice,
    transactionTypes: transactionTypesSlice,
    ledgerTransactions: ledgerTransactionsSlice,
    categories: categorySlice,
    companies: companySlice,
    units: unitReducer,
  },
});
