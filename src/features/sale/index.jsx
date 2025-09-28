import React from "react";
import { Routes, Route } from "react-router-dom";
import Sales from "./Sales";
import CreateSale from "./CreateSale";
import ViewSale from "./ViewSale";

const SalesModule = () => {
  return (
    <Routes>
      <Route path="/" element={<Sales />} />
      <Route path="/create" element={<CreateSale />} />
      <Route path="/edit/:id" element={<CreateSale />} />
      <Route path="/:id" element={<ViewSale />} />
    </Routes>
  );
};

export default SalesModule;
