import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./reducers/account.reducer";
import productReducer from "./reducers/product.reducer";
import purchaseSlice from "./reducers/purchase.reducer";
import journalSlice from "./reducers/journal.reducer";
import appSlice from "./reducers/app.reducer";

export const store = configureStore({
  reducer: {
    app: appSlice,
    accounts: accountSlice,
    products: productReducer,
    purchases: purchaseSlice,
    journals: journalSlice,
  },
});
