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
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createExpenseAsync,
  updateExpenseAsync,
} from "../../store/slices/expenses.slice";
import { toast, ToastContainer } from "react-toastify";
import COLORS from "../../constant/colors";
import axios from "axios";
import { selectLedgers } from "../../store/selectors/ledgers.selector";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectExpenseCategories } from "../../store/selectors/expense.categories.selector";
import { addExpenseCategory } from "../../store/slices/expense.category.slice";

const CreateSubExpense = ({
  open,
  onClose,
  subExpense = null,
  isEdit = false,
}) => {
  const dispatch = useDispatch();
  // const { ExpenseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: subExpense?.name || "",
    description: subExpense?.description || "",
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("SubExpense name is required");
      return;
    }

    try {
      setLoading(true);

      // if (isEdit && subExpense) {
      //   await dispatch(updateSubExpenseAsync({
      //     subExpenseId: subExpense._id,
      //     subExpenseData: formData
      //   })).unwrap();
      //   toast.success("SubExpense updated successfully");
      // } else {
      //   await dispatch(createSubExpenseAsync({
      //     ExpenseId,
      //     subExpenseData: formData
      //   })).unwrap();
      //   toast.success("SubExpense created successfully");
      // }

      const { data } = await axios.post(
        `http://localhost:5000/api/expense-categories`,
        formData
      );

      dispatch(addExpenseCategory({ expenseCategory: data }));
      onClose();
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({ name: "", description: "" });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit SubExpense" : "Create New SubExpense"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="SubExpense Name"
              name="name"
              value={formData.name}
              onChange={handleChange("name")}
              fullWidth
              required
              disabled={loading}
              size="small"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              rows={3}
              disabled={loading}
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  // const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  // const type = searchParams.get("type");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // const selectedExpense = useSelector(selectSelectedExpense);
  // const expenseCategories = useSelector(selectExpenseCategories);

  // const journals = useSelector(selectJournals);
  // const ledgers = useSelector(selectLedgers);
  const expenseCategories = useSelector(selectExpenseCategories);
  const selectedDirection = useSelector(selectDirection);

  console.log({ expenseCategories });

  const [formData, setFormData] = useState({
    expenseCategoryId: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (event) => {
    const { value, name } = event.target;
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

      // navigate("/expenses");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  return (
    <>
      <CreateSubExpense open={open} onClose={() => setOpen(false)} />
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
              onClick={() => setOpen(true)}
              variant="contained"
              disabled={loading || updateLoading}
              sx={{
                backgroundColor: COLORS.PURPLE,
                "&:hover": {
                  backgroundColor: COLORS.PURPLE_DARK,
                },
              }}
            >
              Create Sub Category
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
              <Grid size={4} xs={4} sm={4} padding={1}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  name="expenseCategoryId"
                  label={t("select category")}
                  style={{ minWidth: "200px" }}
                  dir={selectedDirection === "rtl" ? "right" : "left"}
                  value={formData.expenseCategoryId}
                  onChange={handleChange}
                >
                  {expenseCategories.map((item, index) => (
                    <MenuItem key={index} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={4} xs={4} sm={4} padding={1}>
                <TextField
                  fullWidth
                  label={t("amount")}
                  name="amount"
                  type="number"
                  size="small"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={4} xs={4} sm={4} padding={1}>
                <TextField
                  fullWidth
                  label={t("date")}
                  name="date"
                  type="date"
                  size="small"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12} xs={12} sm={12} padding={1}>
                <TextField
                  fullWidth
                  label={t("description")}
                  name="description"
                  type="text"
                  size="small"
                  value={formData.description}
                  onChange={handleChange}
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
    </>
  );
};

export default ExpenseForm;
