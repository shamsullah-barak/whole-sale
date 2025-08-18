import React, { useState } from "react";
import { MenuItem, TextField, Button } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { selectReceivables } from "../../store/selectors/receivable.selector";

const Receivable = () => {
  const { t } = useTranslation();
  const selectedDirection = useSelector(selectDirection);

  const receivables = useSelector(selectReceivables).receivables;
  const [receivable, setReceivable] = useState({
    customerId: "",
    amount: "",
  });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/receivable", receivable, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("data added");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setReceivable((preS) => {
      return {
        ...preS,
        [name]: value,
      };
    });
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} marginTop={3}>
        <Grid size={6} xs={12} sm={12}>
          <TextField
            select
            fullWidth
            required
            name="customerId"
            label={t("customer")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={receivable.customerId}
            onChange={inputHandler}
          >
            {receivables.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {t(`${item.name}`)}-#{t(`${item.address}`)}-#
                {t(`${item.amount}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={6} xs={12} sm={12}>
          <TextField
            fullWidth
            required
            name="amount"
            label={t("amount")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={receivable.amount}
            type="number"
            onChange={inputHandler}
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
        onClick={handleSubmit}
      >
        {t("Add")}
      </Button>
    </>
  );
};

export default Receivable;
