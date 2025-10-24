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
  createInstallmentAsync,
  updateInstallmentAsync,
  fetchInstallmentByIdAsync,
  fetchLoansAsync,
} from "../../store/slices/installment.slice";
import {
  selectCreateInstallmentLoading,
  selectUpdateInstallmentLoading,
  selectSelectedInstallment,
  selectLoans,
  selectLoansLoading,
} from "../../store/selectors/installment.selectors";
import COLORS from "../../constant/colors";
import { toast } from "react-toastify";

const InstallmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const type = searchParams.get("type");

  const createLoading = useSelector(selectCreateInstallmentLoading);
  const updateLoading = useSelector(selectUpdateInstallmentLoading);
  const selectedInstallment = useSelector(selectSelectedInstallment);
  const loans = useSelector(selectLoans);
  const loansLoading = useSelector(selectLoansLoading);

  const [formData, setFormData] = useState({
    loanId: "",
    amount: "",
    type: type || "AP",
    description: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  // Load installment data for edit mode
  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchInstallmentByIdAsync(id));
    }
  }, [dispatch, isEdit, id]);

  // Load loans
  useEffect(() => {
    dispatch(fetchLoansAsync(type));
  }, [dispatch, type]);

  // Update form data when selected installment changes (edit mode)
  useEffect(() => {
    if (isEdit && selectedInstallment) {
      setFormData({
        loanId: selectedInstallment.loanId || "",
        amount: selectedInstallment.amount || "",
        type: selectedInstallment.type || "AP",
        description: selectedInstallment.description || "",
        paymentDate: selectedInstallment.paymentDate || new Date().toISOString().split("T")[0],
      });
    }
  }, [isEdit, selectedInstallment]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!formData.loanId) {
      toast.error("Please select a loan");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const installmentData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (isEdit) {
        await dispatch(updateInstallmentAsync({ installmentId: id, installmentData })).unwrap();
        toast.success("Installment updated successfully");
      } else {
        await dispatch(createInstallmentAsync(installmentData)).unwrap();
        toast.success("Installment created successfully");
      }

      navigate("/installments");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    navigate("/installments");
  };

  const installmentTypes = [
    { value: "AP", label: "Accounts Payable (Payable)" },
    { value: "AR", label: "Accounts Receivable (Receivable)" },
  ];

  // Filter loans by type if specified
  const filteredLoans = type ? loans.filter(loan => loan.type === type) : loans;

  return (
    <Box sx={{ width: "100%" }}>
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
              {isEdit ? "Edit Installment" : "Create New Installment"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit ? "Update installment information" : "Add a new installment payment"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Back to Installments
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
          <Grid container spacing={3}>
            {/* Loan Selection */}
            <Grid item xs={12} sm={6}>
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
                helperText={loansLoading ? "Loading loans..." : "Select the loan for this installment"}
              >
                {filteredLoans.map((loan) => (
                  <MenuItem key={loan.id} value={loan.id}>
                    {loan.name} - {loan.address} - ${loan.amount}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Installment Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Installment Type"
                name="type"
                value={formData.type}
                onChange={handleChange("type")}
                fullWidth
                required
                disabled={!!type} // Disable if type is specified in URL
                size="small"
                helperText={type ? "Type is fixed based on context" : "Select the installment type"}
              >
                {installmentTypes.map((typeOption) => (
                  <MenuItem key={typeOption.value} value={typeOption.value}>
                    {typeOption.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Amount */}
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
                helperText="Enter the installment amount"
              />
            </Grid>

            {/* Payment Date */}
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

            {/* Description */}
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
                helperText="Optional description for this installment"
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={createLoading || updateLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    (createLoading || updateLoading) ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={createLoading || updateLoading}
                  sx={{
                    backgroundColor: COLORS.PURPLE,
                    "&:hover": {
                      backgroundColor: COLORS.PURPLE_DARK,
                    },
                  }}
                >
                  {createLoading || updateLoading
                    ? "Saving..."
                    : isEdit
                    ? "Update Installment"
                    : "Create Installment"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default InstallmentForm;
