import React, { useState } from "react";
import axios from "axios";
import { TextField, MenuItem, Button, Grid2 as Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { ToastContainer, toast } from "react-toastify";
import { fetchExpensesAsync } from "../../store/slices/expenses.slice";
import { selectLedgers } from "../../store/selectors/ledgers.selector";

const MoneyWithdrawal = ({ transactionTypeId }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const selectedDirection = useSelector(selectDirection);
  const ledgers = useSelector(selectLedgers).ledgers;

  const [data, setData] = useState({
    ledgerId: "",
    amount: 0,
    description: "",
  });

  const handleInput = (event) => {
    const [name, value] = event.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);

    setLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/money-withdrawal`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      dispatch(fetchExpensesAsync());
      toast.success("data added");
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
        <Grid size={3} xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t("ledger")}
            name="ledgerId"
            sx={{ width: "100%" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={data.ledgerId}
            onChange={handleInput}
          >
            {ledgers.map((item, index) => (
              <MenuItem key={index} value={item._id}>
                {t(`${item.name}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            label={t(`amount`)}
            name="amount"
            type="number"
            value={data.amount}
            onChange={handleInput}
          />
        </Grid>

        <Grid size={3} xs={12} sm={6}>
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
