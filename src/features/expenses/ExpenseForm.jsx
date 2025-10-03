import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createExpenseAsync,
  updateExpenseAsync,
  fetchExpenseByIdAsync,
} from "../../store/slices/expenses.slice";
import {
  selectSelectedExpense,
  selectLoans,
} from "../../store/selectors/expenses.selector";
import { toast, ToastContainer } from "react-toastify";
import COLORS from "../../constant/colors";
import axios from "axios";
import { selectLedgers } from "../../store/selectors/ledgers.selector";
import { selectDirection } from "../../store/selectors/app.selector";

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const type = searchParams.get("type");

  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const selectedExpense = useSelector(selectSelectedExpense);

  // const journals = useSelector(selectJournals);
  const ledgers = useSelector(selectLedgers);
  const selectedDirection = useSelector(selectDirection);

  // const journalEntryHandler = async (event) => {
  //   event.preventDefault(event);
  //   try {
  //     await axios.post(
  //       `http://localhost:5000/api/journal-entries/money-deposit`,
  //       journalEntry,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     // dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
  //     setJournalEntry({
  //       description: "",
  //       amount: 0,
  //     });

  //     toast.success("data successfully added");
  //   } catch (error) {
  //     toast.error(
  //       error?.response?.data?.message ??
  //         "something went wrong! please try again"
  //     );
  //   }
  // };

  const [formData, setFormData] = useState({
    ledgerId: "",
    amount: 0,
    description: "",
  });

  const handleChange = (event) => {
    const { value, name } = event.target.value;
    console.log({ value, name });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    // if (!formData.loanId) {
    //   toast.error("Please select a loan");
    //   return;
    // }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (isEdit) {
        await dispatch(
          updateExpenseAsync({ expenseId: id, expenseData })
        ).unwrap();
        toast.success("Expense updated successfully");
      } else {
        await dispatch(createExpenseAsync(expenseData)).unwrap();
        toast.success("Expense created successfully");
      }

      navigate("/expenses");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ToastContainer />
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {isEdit ? "Edit Expense" : "Create New Expense"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit
                ? "Update expense information"
                : "Add a new expense payment"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Back to Expenses
          </Button>
        </Stack>
      </Paper>

      {/* Form */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ marginTop: "15px" }}>
            <Grid size={6} xs={6} sm={6} padding={1}>
              <TextField
                select
                fullWidth
                label={t("select ledger")}
                style={{ minWidth: "200px" }}
                dir={selectedDirection === "rtl" ? "right" : "left"}
                value={formData.ledgerId}
                onChange={(value) =>
                  setFormData({ ...formData, ledgerId: value.target.value })
                }
              >
                {ledgers.ledgers?.map((item, index) => (
                  <MenuItem key={index} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6} xs={6} sm={6} padding={1}>
              <TextField
                fullWidth
                label={t("amount")}
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(event) => {
                  setFormData({ ...formData, amount: event.target.value });
                }}
              />
            </Grid>
            <Grid size={12} xs={12} sm={12} padding={1}>
              <TextField
                fullWidth
                label={t("description")}
                name="description"
                type="text"
                value={formData.description}
                onChange={(event) => {
                  setFormData({ ...formData, description: event.target.value });
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={loading || updateLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading || updateLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={loading || updateLoading}
                sx={{
                  backgroundColor: COLORS.PURPLE,
                  "&:hover": {
                    backgroundColor: COLORS.PURPLE_DARK,
                  },
                }}
              >
                {loading || updateLoading
                  ? "Saving..."
                  : isEdit
                  ? "Update Expense"
                  : "Create Expense"}
              </Button>
            </Stack>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ExpenseForm;
