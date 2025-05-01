import { configureStore } from "@reduxjs/toolkit";
import ledgersSlice from "./reducers/ledgers.reducer";
import productReducer from "./reducers/product.reducer";
import purchaseSlice from "./reducers/purchase.reducer";
import journalSlice from "./reducers/journal.reducer";
import appSlice from "./reducers/app.reducer";

export const store = configureStore({
  reducer: {
    app: appSlice,
    ledgers: ledgersSlice,
    products: productReducer,
    purchases: purchaseSlice,
    journals: journalSlice,
  },
});
