import React from "react";
import { Routes, Route } from "react-router-dom";
import SaleReturnsList from "./list";
import SaleReturnCreate from "./create";

const SaleReturnsModule = () => {
  return (
    <Routes>
      <Route path="/" element={<SaleReturnsList />} />
      <Route path="/create" element={<SaleReturnCreate />} />
    </Routes>
  );
};

export default SaleReturnsModule;
