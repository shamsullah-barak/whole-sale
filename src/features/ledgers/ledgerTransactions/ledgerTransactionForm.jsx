import React, { useState } from "react";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import COLORS from "../../../constant/colors";
import { toast, ToastContainer } from "react-toastify";

const financialTerms = [
  "Money deposit",
  "Money withdrawal",
  "Issuing a remittance",
  "Receiving a remittance",
  "Purchase of goods",
  "Purchase return",
  "Sale of goods",
  "Sales return",
  "Settlement of balance",
  "Settlement of receivables",
];

const LedgerTransactionForm = () => {
  const { t } = useTranslation();
  const [ledger, setLedger] = useState({
    note: "",
    price: 0,
    totalPrice: 0,
    salePrice: 0,
    status: "paid",
    companyName: "",
    category: "",
    quantity: 0,
  });

  // ledger handler
  const ledgerTransactionHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ledgers",
        ledger,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLedger({
        note: "",
        price: 0,
        totalPrice: 0,
        salePrice: 0,
        status: "paid",
        companyName: "",
        category: "",
        quantity: 0,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <form>
        <Grid container>
          <Grid xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={ledger.status}
              onChange={(event) =>
                setLedger({ ...ledger, status: event.target.value })
              }
            >
              {financialTerms.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={ledger.quantity}
              onChange={(event) =>
                setLedger({
                  ...ledger,
                  quantity: event.target.value,
                  totalPrice: ledger.price * event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="inherit"
          style={{ marginTop: 20 }}
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
            color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
          })}
          onClick={ledgerTransactionHandler}
        >
          {t("createLedgerTransaction")}
        </Button>
      </form>
    </>
  );
};

export default LedgerTransactionForm;
