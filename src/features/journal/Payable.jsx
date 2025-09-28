import React, { useState, useEffect } from "react";
import { MenuItem, TextField, Button } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";
import { 
  createInstallmentAsync, 
  fetchLoansAsync 
} from "../../store/slices/installment.slice";
import { 
  selectLoans, 
  selectCreateInstallmentLoading 
} from "../../store/selectors/installment.selectors";

const Payable = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const journals = useSelector(selectJournals);
  const loans = useSelector(selectLoans);
  const selectedDirection = useSelector(selectDirection);
  const createLoading = useSelector(selectCreateInstallmentLoading);

  const [payable, setPayable] = useState({
    loanId: "",
    amount: "",
    type: "AP",
    description: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  // Load payable loans on component mount
  useEffect(() => {
    dispatch(fetchLoansAsync("AP"));
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!payable.loanId) {
      toast.error("Please select a loan");
      return;
    }
    if (!payable.amount || payable.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const installmentData = {
        ...payable,
        amount: parseFloat(payable.amount),
      };

      await dispatch(createInstallmentAsync(installmentData)).unwrap();
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
      toast.success("Installment payment added successfully");
      
      // Reset form
      setPayable({
        loanId: "",
        amount: "",
        type: "AP",
        description: "",
        paymentDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong! Please try again");
    }
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setPayable((preS) => {
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
            value={payable.loanId}
            onChange={inputHandler}
          >
            {loans.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name} - {item.address} - ${item.amount}
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
            value={payable.amount}
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
        disabled={createLoading}
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

export default Payable;
