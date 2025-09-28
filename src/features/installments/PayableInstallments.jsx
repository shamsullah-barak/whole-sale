import React from "react";
import InstallmentList from "./InstallmentList";

const PayableInstallments = () => {
  return (
    <InstallmentList 
      type="AP" 
      title="Payable Installments" 
    />
  );
};

export default PayableInstallments;
