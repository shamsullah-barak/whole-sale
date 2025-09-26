import React from "react";
import { createRoot } from "react-dom/client";
import CrudDashboard from "./CrudDashboard";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import "./i18n";
import { store } from "./store";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <CrudDashboard />
  </Provider>
);

reportWebVitals();
