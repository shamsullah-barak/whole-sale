import React, { useState } from "react";
import { MenuItem, TextField, Button } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { selectReceivables } from "../../store/selectors/receivable.selector";
import { fetchReceivablesAsync } from "../../store/slices/receivable.slice";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";

const Receivable = () => {
  const { t } = useTranslation();
  const selectedDirection = useSelector(selectDirection);

  const dispatch = useDispatch();
  const journals = useSelector(selectJournals);
  const receivables = useSelector(selectReceivables).receivables;

  const [loading, setLoading] = useState(false);
  const [receivable, setReceivable] = useState({
    loanId: "",
    amount: "",
    type: "AR",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/installments", receivable, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      toast.success("data added");
      dispatch(fetchReceivablesAsync());
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
    } catch (error) {
      setLoading(false);
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
            name="loanId"
            label={t("customer")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={receivable.loanId}
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
        loading={loading}
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
