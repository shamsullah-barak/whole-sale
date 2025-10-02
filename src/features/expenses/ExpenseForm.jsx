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
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Divider,
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

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);
    try {
      await axios.post(
        `http://localhost:5000/api/journal-entries/money-deposit`,
        journalEntry,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
      setJournalEntry({
        description: "",
        amount: 0,
      });

      toast.success("data successfully added");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  const [journalEntry, setJournalEntry] = useState({
    description: "",
    amount: 0,
    ledgerId: "",
    ledgerInfo: "",
  });

  const [formData, setFormData] = useState({
    loanId: "",
    amount: "",
    type: type || "AP",
    description: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  // Load expense data for edit mode
  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchExpenseByIdAsync(id));
    }
  }, [dispatch, isEdit, id]);

  // Update form data when selected expense changes (edit mode)
  useEffect(() => {
    if (isEdit && selectedExpense) {
      setFormData({
        loanId: selectedExpense.loanId || "",
        amount: selectedExpense.amount || "",
        type: selectedExpense.type || "AP",
        description: selectedExpense.description || "",
        paymentDate:
          selectedExpense.paymentDate || new Date().toISOString().split("T")[0],
      });
    }
  }, [isEdit, selectedExpense]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const expenseTypes = [
    { value: "AP", label: "Accounts Payable (Payable)" },
    { value: "AR", label: "Accounts Receivable (Receivable)" },
  ];

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
                value={journalEntry.ledgerId}
                onChange={(event) => {
                  const selectedLedger = ledgers.ledgers.find(
                    (ledger) => ledger._id === event.target.value
                  );
                  setJournalEntry({
                    ...journalEntry,
                    ledgerId: selectedLedger._id,
                    ledgerInfo: selectedLedger.name,
                  });
                }}
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
                label={t("Quantity")}
                name="amount"
                type="number"
                value={journalEntry.amount}
                onChange={(event) =>
                  setJournalEntry({
                    ...journalEntry,
                    amount: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid size={12} xs={12} sm={12} padding={1}>
              <TextField
                fullWidth
                label={t("description")}
                name="description"
                type="text"
                value={journalEntry.description}
                onChange={(event) =>
                  setJournalEntry({
                    ...journalEntry,
                    description: event.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
          {/* <Button
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
                    onClick={journalEntryHandler}
                  >
                    {t("Add")}
                  </Button> */}

          {/*    <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Loan"
                name="loanId"
                value={formData.loanId}
                onChange={handleChange("loanId")}
                fullWidth
                required
                disabled={loansLoading}
                size="small"
                helperText={
                  loansLoading
                    ? "Loading loans..."
                    : "Select the loan for this expense"
                }
              >
                {filteredLoans.map((loan) => (
                  <MenuItem key={loan.id} value={loan.id}>
                    {loan.name} - {loan.address} - ${loan.amount}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

     
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Expense Type"
                name="type"
                value={formData.type}
                onChange={handleChange("type")}
                fullWidth
                required
                disabled={!!type} // Disable if type is specified in URL
                size="small"
                helperText={
                  type
                    ? "Type is fixed based on context"
                    : "Select the expense type"
                }
              >
                {expenseTypes.map((typeOption) => (
                  <MenuItem key={typeOption.value} value={typeOption.value}>
                    {typeOption.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange("amount")}
                fullWidth
                required
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Enter the expense amount"
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={handleChange("paymentDate")}
                fullWidth
                required
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange("description")}
                fullWidth
                multiline
                rows={3}
                size="small"
                helperText="Optional description for this expense"
              />
            </Grid>

*/}
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
