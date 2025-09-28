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
  PointOfSale as PointOfSaleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchSalesAsync,
  setSelectedSale,
  deleteSaleAsync,
} from "../../store/slices/sale.slice";
import {
  selectSalesList,
  selectSalesLoading,
  selectSalesPagination,
  selectDeleteSaleLoading,
} from "../../store/selectors/sale.selectors";
import Datagrid from "../../components/DataGrid";
import COLORS from "../../constant/colors";
import formatDate from "../../utils/moment";
import { toast } from "react-toastify";

// Columns will be defined inside the component to access handler functions

const SalesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sales = useSelector(selectSalesList);
  const loading = useSelector(selectSalesLoading);
  const deleteLoading = useSelector(selectDeleteSaleLoading);
  const pagination = useSelector(selectSalesPagination);

  useEffect(() => {
    const loadSales = () => {
      dispatch(
        fetchSalesAsync({ page: 1, limit: pagination.limitPerPage || 20 })
      );
    };
    loadSales();
  }, [dispatch, pagination.limitPerPage]);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchSalesAsync({ page: page + 1, limit: pageSize }));
  };

  const handleRowClick = (params) => {
    dispatch(setSelectedSale({ sale: params.row }));
    navigate(`/sales/${params.row._id}`);
  };

  const handleCreateSale = () => {
    navigate("/sales/create");
  };

  const handleEditSale = (saleId) => {
    navigate(`/sales/edit/${saleId}`);
  };

  const handleViewSale = (saleId) => {
    navigate(`/sales/${saleId}`);
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await dispatch(deleteSaleAsync(saleId)).unwrap();
        toast.success("Sale deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete sale");
      }
    }
  };

  // Define columns inside component to access handler functions
  const columns = [
    {
      field: "saleNumber",
      headerName: "Sale #",
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
              handleViewSale(params.row._id);
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
              handleEditSale(params.row._id);
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
              handleDeleteSale(params.row._id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading && sales.length === 0) {
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
              <PointOfSaleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Sales Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your sales transactions and customer orders
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateSale}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Create Sale
          </Button>
        </Stack>
      </Paper>

      {/* Sales Grid */}
      {sales.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <PointOfSaleIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            No Sales Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first sale to start tracking your transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateSale}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Create Sale
          </Button>
        </Paper>
      ) : (
        <Datagrid
          rows={sales}
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

const Sales = () => {
  return <SalesList />;
};

export default Sales;
