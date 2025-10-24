import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  TextField,
  MenuItem,
  Button,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { ToastContainer, toast } from "react-toastify";
import { fetchExpensesAsync } from "../../store/slices/expenses.slice";
import { selectPayable } from "../../store/selectors/payable.selector";
import { fetchPayableAsync } from "../../store/slices/payable.slice";
import { selectCashboxBalances } from "../../store/selectors/cashbox.selector";
import { fetchCashboxBalancesAsync } from "../../store/slices/cashbox.slice";
import { fetchReceivablesAsync } from "../../store/slices/receivable.slice";

const MoneyWithdrawal = ({ transactionTypeId }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const selectedDirection = useSelector(selectDirection);
  const payableState = useSelector(selectPayable);
  const cashboxBalances = useSelector(selectCashboxBalances);

  const [data, setData] = useState({
    ledgerId: "",
    amount: 0,
    description: "",
  });

  // fetch payable accounts and cashbox balances on mount
  useEffect(() => {
    dispatch(fetchPayableAsync());
    dispatch(fetchCashboxBalancesAsync());
  }, [dispatch]);

  const payableAccounts = useMemo(
    () => payableState?.payable ?? [],
    [payableState]
  );

  const selectedAccount = useMemo(
    () => payableAccounts.find((p) => (p._id || p.id) === data.ledgerId),
    [payableAccounts, data.ledgerId]
  );

  const balancesByType = useMemo(() => {
    const map = {};
    (cashboxBalances || []).forEach((b) => {
      if (b?.type) {
        map[String(b.type).toLowerCase()] = Number(b.totalCash) || 0;
      }
    });
    return map;
  }, [cashboxBalances]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);

    setLoading(true);

    try {
      // basic validations
      if (!data.ledgerId) {
        setLoading(false);
        toast.error("Please select an account");
        return;
      }
      if (!data.amount || Number(data.amount) <= 0) {
        setLoading(false);
        toast.error("Please enter a valid amount");
        return;
      }

      // currency-specific balance validation
      const currencyType = String(
        selectedAccount?.currencyType || ""
      ).toLowerCase();
      const available = balancesByType[currencyType] ?? 0;
      if (available < Number(data.amount)) {
        setLoading(false);
        toast.error(
          `Insufficient ${
            currencyType || "cash"
          } balance in cashbox. Available: ${available}`
        );
        return;
      }

      await axios.post(
        `http://localhost:5000/api/journal-entries/money-withdrawal`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      dispatch(fetchExpensesAsync());
      dispatch(fetchCashboxBalancesAsync());
      dispatch(fetchPayableAsync());
      dispatch(fetchReceivablesAsync());
      toast.success("data added");
      setData({ ledgerId: "", amount: 0, description: "" });
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} sx={{ marginTop: "15px" }}>
        <Grid size={12} xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t("payable account")}
            name="ledgerId"
            sx={{ width: "100%" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={data.ledgerId}
            onChange={handleInput}
          >
            {payableAccounts.map((item, index) => (
              <MenuItem key={index} value={item._id || item.id}>
                <Typography variant="body1">{item.name}</Typography>
                {"     "}
                <Typography variant="caption" color="text.secondary">
                  ledger type: {item.ledgerType} | currencyType:{" "}
                  {item.currencyType}
                </Typography>
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={6} xs={12} sm={6}>
          <TextField
            fullWidth
            label={t(`amount`)}
            name="amount"
            type="number"
            value={data.amount}
            onChange={handleInput}
          />
        </Grid>

        <Grid size={6} xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("description")}
            name="description"
            type="text"
            value={data.description}
            onChange={handleInput}
          />
        </Grid>
      </Grid>
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="inherit"
        disabled={loading}
        loading={loading}
        style={{ marginTop: 20 }}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
          color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
        })}
        onClick={journalEntryHandler}
      >
        {t("Add")}
      </Button>
    </>
  );
};

export default MoneyWithdrawal;
