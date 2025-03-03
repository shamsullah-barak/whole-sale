import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import productReducer from "../features/products/productSlice";
import purchaseSlice from "../features/purchases/purchaseSlice";
import accountSlice from "../features/accounts/accountSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productReducer,
    purchases: purchaseSlice,
    accounts: accountSlice,
  },
});
