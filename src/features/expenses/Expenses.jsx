import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchExpensesAsync,
  setSelectedExpense,
  deleteExpenseAsync,
} from "../../store/slices/expenses.slice";
import {
  selectExpensesList,
  selectExpensesLoading,
  selectExpensesPagination,
  selectDeleteExpenseLoading,
} from "../../store/selectors/expenses.selector";
import Datagrid from "../../components/DataGrid";
import COLORS from "../../constant/colors";
import formatDate from "../../utils/moment";
import { toast } from "react-toastify";

// Columns will be defined inside the component to access handler functions

const ExpensesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const expenses = useSelector(selectExpensesList);
  const loading = useSelector(selectExpensesLoading);
  const deleteLoading = useSelector(selectDeleteExpenseLoading);
  const pagination = useSelector(selectExpensesPagination);

  useEffect(() => {
    const loadExpenses = () => {
      dispatch(
        fetchExpensesAsync({ page: 1, limit: pagination.limitPerPage || 20 })
      );
    };
    loadExpenses();
  }, [dispatch, pagination.limitPerPage]);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchExpensesAsync({ page: page + 1, limit: pageSize }));
  };

  const handleRowClick = (params) => {
    dispatch(setSelectedExpense({ expenses: params.row }));
    navigate(`/expenses/${params.row._id}`);
  };

  const handleCreateExpense = () => {
    navigate("/expenses/create");
  };

  const handleEditExpense = (ExpenseId) => {
    navigate(`/expenses/edit/${ExpenseId}`);
  };

  const handleViewExpense = (ExpenseId) => {
    navigate(`/expenses/${ExpenseId}`);
  };

  const handleDeleteExpense = async (ExpenseId) => {
    if (window.confirm("Are you sure you want to delete this expenses?")) {
      try {
        await dispatch(deleteExpenseAsync(ExpenseId)).unwrap();
        toast.success("Expense deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete expenses");
      }
    }
  };

  // Define columns inside component to access handler functions
  const columns = [
    {
      field: "ExpenseNumber",
      headerName: "Expense #",
      flex: 0.5,
      minWidth: 100,
      align: "center",
    },
    {
      field: "customerName",
      headerName: "Customer",
      flex: 1,
      minWidth: 150,
      align: "left",
    },
    {
      field: "productName",
      headerName: "Product",
      flex: 1,
      minWidth: 150,
      align: "left",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.5,
      minWidth: 100,
      align: "center",
    },
    {
      field: "unitPrice",
      headerName: "Unit Price",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      valueFormatter: (params) => {
        return params ? `$${params.toFixed(2)}` : "$0.00";
      },
    },
    {
      field: "totalPrice",
      headerName: "Total",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      valueFormatter: (params) => {
        return params ? `$${params.toFixed(2)}` : "$0.00";
      },
    },
    {
      field: "paymentMethod",
      headerName: "Payment",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "cash"
              ? "success"
              : params.value === "credit"
              ? "warning"
              : "info"
          }
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 0.5,
      minWidth: 120,
      align: "center",
      valueFormatter: (params) => {
        return formatDate(params);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            color="primary"
            aria-label="view"
            onClick={(e) => {
              e.stopPropagation();
              handleViewExpense(params.row._id);
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            aria-label="edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEditExpense(params.row._id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteExpense(params.row._id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading && expenses.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

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
              <AttachMoneyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Expense Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your expenses transactions and customer orders
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateExpense}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Create Expense
          </Button>
        </Stack>
      </Paper>

      {/* Expense Grid */}
      {expenses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <AttachMoneyIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            No Expenses Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first Expense to start tracking your transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateExpense}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Create Expense
          </Button>
        </Paper>
      ) : (
        <Datagrid
          rows={expenses}
          columns={columns}
          limitPerPage={pagination.limitPerPage}
          loading={loading}
          totalRows={pagination.totalRows}
          currentPage={pagination.currentPage}
          stateChanged={stateChanged}
          onRowClick={(params, event) => handleRowClick(params)}
        />
      )}
    </Box>
  );
};

const Expense = () => {
  return <ExpensesList />;
};

export default Expense;
