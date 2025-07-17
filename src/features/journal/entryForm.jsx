import React, { useState } from "react";
import { TextField, MenuItem, Grid2 as Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectTransactionTypes } from "../../store/selectors/transaction.types.selector";
import MoneyDeposit from "./moneyDepositEntry";
import PurchaseOfGoods from "./purchaseEntry";
import MoneyWithdrawal from "./moneyWithdrawal";

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
      {status.statusName === "money deposit" && (
        <MoneyDeposit statusId={status.statusId} />
      )}

      {/* purchasing something */}
      {status.statusName === "purchase of goods" && (
        <PurchaseOfGoods statusId={status.statusId} />
      )}

      {/* purchasing something */}
      {status.statusName === "money withdrawal" && (
        <MoneyWithdrawal transactionTypeId={status.statusId} />
      )}
    </>
  );
};

export default EntryForm;
