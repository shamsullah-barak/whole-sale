import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import productReducer from "../features/products/productSlice";
import purchaseSlice from "../features/purchases/purchaseSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productReducer,
    purchases: purchaseSlice,
  },
});
