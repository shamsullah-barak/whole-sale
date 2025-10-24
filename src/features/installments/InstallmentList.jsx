import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchInstallmentsAsync,
  setSelectedInstallment,
  deleteInstallmentAsync,
  fetchLoansAsync,
} from "../../store/slices/installment.slice";
import {
  selectInstallmentsList,
  selectInstallmentsLoading,
  selectInstallmentsPagination,
  selectDeleteInstallmentLoading,
  selectLoans,
} from "../../store/selectors/installment.selectors";
import Datagrid from "../../components/DataGrid";
import COLORS from "../../constant/colors";
import formatDate from "../../utils/moment";
import { toast } from "react-toastify";

const InstallmentList = ({ type = null, title = "Installments" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const installments = useSelector(selectInstallmentsList);
  const loading = useSelector(selectInstallmentsLoading);
  const deleteLoading = useSelector(selectDeleteInstallmentLoading);
  const pagination = useSelector(selectInstallmentsPagination);
  const loans = useSelector(selectLoans);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const loadData = () => {
      dispatch(
        fetchInstallmentsAsync({
          page: 1,
          limit: pagination.limitPerPage || 20,
          type,
        })
      );
      dispatch(fetchLoansAsync(type));
    };
    loadData();
  }, [dispatch, pagination.limitPerPage, type]);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchInstallmentsAsync({ page: page + 1, limit: pageSize, type }));
  };

  const handleRowClick = (params) => {
    dispatch(setSelectedInstallment({ installment: params.row }));
    navigate(`/installments/${params.row._id}`);
  };

  const handleCreateInstallment = () => {
    navigate(`/installments/create${type ? `?type=${type}` : ""}`);
  };

  const handleEditInstallment = (installmentId) => {
    navigate(`/installments/edit/${installmentId}`);
  };

  const handleViewInstallment = (installmentId) => {
    navigate(`/installments/${installmentId}`);
  };

  const handleViewHistory = (loanId) => {
    navigate(`/installments/history/${loanId}`);
  };

  const handleDeleteInstallment = async (installmentId) => {
    if (window.confirm("Are you sure you want to delete this installment?")) {
      try {
        await dispatch(deleteInstallmentAsync(installmentId)).unwrap();
        toast.success("Installment deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete installment");
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const newType = newValue === 0 ? null : newValue === 1 ? "AP" : "AR";
    dispatch(
      fetchInstallmentsAsync({
        page: 1,
        limit: pagination.limitPerPage || 20,
        type: newType,
      })
    );
  };

  // Define columns inside component to access handler functions
  const columns = [
    {
      field: "loanId",
      headerName: "Loan ID",
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
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      valueFormatter: (params) => {
        return params ? `$${params.toFixed(2)}` : "$0.00";
      },
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value === "AP" ? "Payable" : "Receivable"}
          color={params.value === "AP" ? "error" : "success"}
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
      width: 150,
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
              handleViewInstallment(params.row._id);
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
              handleEditInstallment(params.row._id);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="info"
            aria-label="history"
            onClick={(e) => {
              e.stopPropagation();
              handleViewHistory(params.row.loanId);
            }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteInstallment(params.row._id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading && installments.length === 0) {
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
              <PaymentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage installment payments and receipts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInstallment}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Add Installment
          </Button>
        </Stack>
      </Paper>

      {/* Tabs for filtering by type */}
      {!type && (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="installment type tabs"
            sx={{ px: 2 }}
          >
            <Tab label="All Installments" />
            <Tab label="Payable (AP)" />
            <Tab label="Receivable (AR)" />
          </Tabs>
        </Paper>
      )}

      {/* Installments Grid */}
      {installments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <PaymentIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Installments Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first installment to start tracking payments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInstallment}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Add Installment
          </Button>
        </Paper>
      ) : (
        // <Datagrid
        //   rows={installments}
        //   columns={columns}
        //   limitPerPage={pagination.limitPerPage}
        //   loading={loading}
        //   totalRows={pagination.totalRows}
        //   currentPage={pagination.currentPage}
        //   stateChanged={stateChanged}
        //   onRowClick={(params, event) => handleRowClick(params)}
        // />
        <></>
      )}
    </Box>
  );
};

export default InstallmentList;
