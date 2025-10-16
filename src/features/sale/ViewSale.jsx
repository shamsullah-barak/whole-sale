import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchSaleByIdAsync,
  deleteSaleAsync,
  setSelectedSale,
} from "../../store/slices/sale.slice";
import {
  selectSelectedSale,
  selectSalesLoading,
  selectDeleteSaleLoading,
} from "../../store/selectors/sale.selectors";
import COLORS from "../../constant/colors";
import formatDate from "../../utils/moment";
import { toast } from "react-toastify";
import axios from "axios";
import Datagrid from "../../components/DataGrid";

const ViewSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const selectedSale = useSelector(selectSelectedSale);
  const loading = useSelector(selectSalesLoading);
  const deleteLoading = useSelector(selectDeleteSaleLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchSaleByIdAsync(id));
    }
  }, [dispatch, id]);

  const [items, setItems] = useState([]);
  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(`/api/sales/${id}/with-items`);
      setItems(data.items || []);
    };
    if (id) load();
  }, [id]);

  const handleEdit = () => {
    navigate(`/sales/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await dispatch(deleteSaleAsync(id)).unwrap();
        toast.success("Sale deleted successfully");
        navigate("/sales");
      } catch (error) {
        toast.error(error.message || "Failed to delete sale");
      }
    }
  };

  const handleBack = () => {
    navigate("/sales");
  };

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "cash":
        return "success";
      case "credit":
        return "warning";
      case "cashAndCredit":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) {
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

  if (!selectedSale) {
    return (
      <Box sx={{ width: "100%" }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Sale Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The sale you're looking for doesn't exist or has been deleted.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Back to Sales
          </Button>
        </Paper>
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
              Sale #{selectedSale.saleNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sale Details and Information
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => {
                // Handle share functionality
                navigator.clipboard.writeText(window.location.href);
                toast.success("Sale link copied to clipboard");
              }}
            >
              Share
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: COLORS.PURPLE,
                "&:hover": {
                  backgroundColor: COLORS.PURPLE_DARK,
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Sale Details */}
      <Grid container spacing={3}>
        {/* Sale Information */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Sale Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Sale Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  #{selectedSale.saleNumber}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(selectedSale.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedSale.customerName || "N/A"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Product
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedSale.productName || "N/A"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Quantity
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedSale.quantity} {selectedSale.unitType}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Unit Price
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${selectedSale.unitPrice?.toFixed(2) || "0.00"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Discount
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${selectedSale.discount?.toFixed(2) || "0.00"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Price
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${selectedSale.totalPrice?.toFixed(2) || "0.00"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Payment Information */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
                <Chip
                  label={selectedSale.paymentMethod}
                  color={getPaymentMethodColor(selectedSale.paymentMethod)}
                  variant="outlined"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Cash Given
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${selectedSale.givingCash?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Remaining Balance
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium"
                  color={selectedSale.remainingCash > 0 ? "error" : "success"}
                >
                  ${selectedSale.remainingCash?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Datagrid
              rows={items}
              columns={[
                { field: "productId", headerName: "Product", flex: 1, minWidth: 140 },
                { field: "quantity", headerName: "Qty", flex: 0.5, minWidth: 80 },
                { field: "unitType", headerName: "Type", flex: 0.5, minWidth: 80 },
                { field: "unitPerPackage", headerName: "Per Pack", flex: 0.6, minWidth: 100 },
                { field: "unitPrice", headerName: "Unit Price", flex: 0.6, minWidth: 120 },
                { field: "totalPrice", headerName: "Total", flex: 0.6, minWidth: 120 },
              ]}
              autoHeight
              hideFooterSelectedRowCount
            />
          </Paper>
        </Grid>

        {/* Description */}
        {selectedSale.description && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                {selectedSale.description}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ViewSale;
