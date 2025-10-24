import React from "react";
import { Routes, Route } from "react-router-dom";
import PurchaseReturnsList from "./list";
import PurchaseReturnCreate from "./create";

const PurchaseReturnsModule = () => {
  return (
    <Routes>
      <Route path="/" element={<PurchaseReturnsList />} />
      <Route path="/create" element={<PurchaseReturnCreate />} />
    </Routes>
  );
};

export default PurchaseReturnsModule;
