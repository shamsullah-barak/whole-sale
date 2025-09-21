import React, { useState } from "react";
import { TextField, MenuItem, Grid2 as Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectTransactionTypes } from "../../store/selectors/transaction.types.selector";
import MoneyDeposit from "./moneyDepositEntry";
import PurchaseOfGoods from "./purchaseEntry";
import MoneyWithdrawal from "./moneyWithdrawal";
import PurchaseReturnForm from "./PurchaseReturn";
import Sales from "./Sales";
import SaleReturn from "./SaleReturn";
import Receivable from "./Receivable";
import Payable from "./Payable";

const EntryForm = () => {
  const [status, setStatus] = useState({ statusId: "", statusName: "" });
  const transactionTypes = useSelector(selectTransactionTypes);
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();

  return (
    <>
      <Grid xs={12} sm={12} marginTop={"15px"} padding={"3px"}>
        <TextField
          select
          fullWidth
          label={t("Status")}
          name="status"
          value={status.statusId || ""} // default empty string if null
          onChange={(event) => {
            const selectedId = event.target.value;
            const selectedType = transactionTypes.find(
              (item) => item.id === selectedId
            );
            setStatus({
              statusName: selectedType.engName,
              statusId: selectedId,
            });
          }}
          style={{ minWidth: "200px" }}
        >
          {transactionTypes.map((item) => (
            <MenuItem key={item.id} value={item.id} dir={selectedDirection}>
              {t(`${item.engName}`)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* money deposit */}
      {status.statusName === "Money Deposit" && (
        <MoneyDeposit statusId={status.statusId} />
      )}

      {/* purchasing something */}
      {status.statusName === "Purchase of Goods" && (
        <PurchaseOfGoods statusId={status.statusId} />
      )}

      {/* purchasing something */}
      {status.statusName === "Money Withdrawal" && (
        <MoneyWithdrawal transactionTypeId={status.statusId} />
      )}

      {/* purchase return */}
      {status.statusName === "Purchase Return" && (
        <PurchaseReturnForm transactionTypeId={status.statusId} />
      )}

      {/* sale */}
      {status.statusName === "Sale of Goods" && (
        <Sales transactionTypeId={status.statusId} />
      )}

      {/* sale return */}
      {status.statusName === "Sales Return" && (
        <SaleReturn transactionTypeId={status.statusId} />
      )}

      {/* Settlement of Receivable */}
      {status.statusName === "Settlement of Receivables" && (
        <Receivable transactionTypeId={status.statusId} />
      )}

      {/* Settlement of Balance */}
      {status.statusName === "Settlement of Balance" && (
        <Payable transactionTypeId={status.statusId} />
      )}
    </>
  );
};

export default EntryForm;
