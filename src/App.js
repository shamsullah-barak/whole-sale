import React, { useEffect } from "react";
import Router from "./routes/routes";
import "./i18n";
import "./App.css";
import { useDispatch } from "react-redux";
import { fetchProductsAsync } from "./store/slices/product.slice";
import { fetchJournalsAsync } from "./store/slices/journal.slice";
import {
  fetchCashBoxAsync,
  fetchLedgersAsync,
} from "./store/slices/ledger.slice";
import { fetchTransactionTypesAsync } from "./store/slices/transaction.types.slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCashBoxAsync());
    dispatch(fetchProductsAsync({ limit: 10, page: 1 }));
    dispatch(fetchJournalsAsync({ limit: 10, page: 1 }));
    dispatch(fetchLedgersAsync({ limit: 10, page: 1 }));
    dispatch(fetchTransactionTypesAsync());
  }, []);
  return <Router />;
}

export default App;
