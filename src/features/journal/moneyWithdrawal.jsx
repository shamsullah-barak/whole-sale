import React, { useState } from "react";
import axios from "axios";
import { TextField, MenuItem, Button, Grid2 as Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { ToastContainer, toast } from "react-toastify";
import { fetchExpensesAsync } from "../../store/slices/expenses.slice";

const reasons = ["shopExpense"];
const shopExpenses = [
  "rent",
  "electricityBill",
  "waterBill",
  "internetBill",
  "salariesOfEmployees",
  "cleaningSupplies",
  "packagingMaterials",
  "transportationCost",
  "maintenanceAndRepairs",
  "securityServices",
  "shopInsurance",
  "marketingAndAdvertising",
  "licensingAndPermits",
  "POSSystemSubscription",
  "inventoryPurchase",
  "uniformsForStaff",
  "furnitureAndFixtures",
  "stationery",
  "softwareSubscriptions",
  "wasteDisposal",
  "mobileRechargeForBusiness",
  "refreshmentsForStaff",
  "bankCharges",
  "loanInstallments",
  "emergencyFundExpenses",
  "others",
];

const MoneyWithdrawal = ({ transactionTypeId }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setShopExpense] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const selectedDirection = useSelector(selectDirection);

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);

    setLoading(true);
    const data = { reason, type, description, amount };
    try {
      await axios.post(
        `http://localhost:5000/api/expenses?transactionTypeId=${transactionTypeId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
        <Grid xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t("reason")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
            }}
          >
            {reasons.map((item, index) => (
              <MenuItem key={index} value={item}>
                {t(`${item}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {reason === "shopExpense" && (
          <Grid xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label={t("type")}
              style={{ minWidth: "200px" }}
              dir={selectedDirection === "rtl" ? "right" : "left"}
              value={type}
              onChange={(event) => {
                setShopExpense(event.target.value);
              }}
            >
              {shopExpenses.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {t(`${item}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t(`amount`)}
            name="amount"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("description")}
            name="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
