import React from "react";
import { Routes, Route } from "react-router-dom";
import InstallmentList from "./InstallmentList";
import InstallmentForm from "./InstallmentForm";
import PayableInstallments from "./PayableInstallments";
import ReceivableInstallments from "./ReceivableInstallments";

const InstallmentsModule = () => {
  return (
    <Routes>
      <Route path="/" element={<InstallmentList />} />
      <Route path="/payable" element={<PayableInstallments />} />
      <Route path="/receivable" element={<ReceivableInstallments />} />
      <Route path="/create" element={<InstallmentForm />} />
      <Route path="/edit/:id" element={<InstallmentForm />} />
      <Route path="/:id" element={<div>Installment Details View (To be implemented)</div>} />
    </Routes>
  );
};

export default InstallmentsModule;
