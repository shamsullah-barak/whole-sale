// select all purchases
export const selectPurchases = (state) => state.purchases;

// select all purchases
export const selectPurchasesList = (state) => state.purchases.purchases;

// select next invoice number
export const selectNextInvoiceNo = (state) => state.purchases.nextInvoiceNo;
