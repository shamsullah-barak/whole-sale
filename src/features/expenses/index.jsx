import React from "react";
import { Routes, Route } from "react-router-dom";
import Expenses from "./Expenses";
import ExpenseForm from "./ExpenseForm";

const InstallmentsModule = () => {
  return (
    <Routes>
      <Route path="/" element={<Expenses />} />
      <Route path="/create" element={<ExpenseForm />} />
      <Route path="/edit/:id" element={<ExpenseForm />} />
      <Route path="/:id" element={<div>expense details</div>} />
    </Routes>
  );
};

export default InstallmentsModule;
