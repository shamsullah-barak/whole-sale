import React from "react";
import InstallmentList from "./InstallmentList";

const ReceivableInstallments = () => {
  return (
    <InstallmentList 
      type="AR" 
      title="Receivable Installments" 
    />
  );
};

export default ReceivableInstallments;
