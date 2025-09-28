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
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createSaleAsync,
  updateSaleAsync,
  fetchSaleByIdAsync,
  fetchNextSaleNumberAsync,
} from "../../store/slices/sale.slice";
import {
  selectCreateSaleLoading,
  selectUpdateSaleLoading,
  selectSelectedSale,
  selectNextSaleNumber,
} from "../../store/selectors/sale.selectors";
import { selectCustomers } from "../../store/selectors/businessEntity.selector";
import { selectStocks } from "../../store/selectors/stock.selector";
import COLORS from "../../constant/colors";
import { toast } from "react-toastify";

const CreateSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams(); // For edit mode
  const isEdit = Boolean(id);

  const createLoading = useSelector(selectCreateSaleLoading);
  const updateLoading = useSelector(selectUpdateSaleLoading);
  const selectedSale = useSelector(selectSelectedSale);
  const nextSaleNumber = useSelector(selectNextSaleNumber);
  const customers = useSelector(selectCustomers).customers;
  const stocks = useSelector(selectStocks).stockNames;

  const [formData, setFormData] = useState({
    saleNumber: "",
    customerId: "",
    stockId: "",
    stockItemId: "",
    quantity: "",
    unitType: "",
    unitPerPackage: "",
    unitPrice: "",
    totalPrice: "",
    discount: 0,
    paymentMethod: "cash",
    givingCash: "",
    remainingCash: "",
    description: "",
  });

  const [stockItems, setStockItems] = useState([]);
  const [loadingStockItems, setLoadingStockItems] = useState(false);

  // Load sale data for edit mode
  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSaleByIdAsync(id));
    } else {
      // Load next sale number for create mode
      dispatch(fetchNextSaleNumberAsync());
    }
  }, [dispatch, isEdit, id]);

  // Update form data when selected sale changes (edit mode)
  useEffect(() => {
    if (isEdit && selectedSale) {
      setFormData({
        saleNumber: selectedSale.saleNumber || "",
        customerId: selectedSale.customerId || "",
        stockId: selectedSale.stockId || "",
        stockItemId: selectedSale.stockItemId || "",
        quantity: selectedSale.quantity || "",
        unitType: selectedSale.unitType || "",
        unitPerPackage: selectedSale.unitPerPackage || "",
        unitPrice: selectedSale.unitPrice || "",
        totalPrice: selectedSale.totalPrice || "",
        discount: selectedSale.discount || 0,
        paymentMethod: selectedSale.paymentMethod || "cash",
        givingCash: selectedSale.givingCash || "",
        remainingCash: selectedSale.remainingCash || "",
        description: selectedSale.description || "",
      });
    } else if (!isEdit && nextSaleNumber) {
      setFormData(prev => ({
        ...prev,
        saleNumber: nextSaleNumber.toString(),
      }));
    }
  }, [isEdit, selectedSale, nextSaleNumber]);

  // Load stock items when stock is selected
  useEffect(() => {
    const fetchStockItems = async () => {
      if (!formData.stockId) return;

      setLoadingStockItems(true);
      try {
        const selectedStock = stocks.find(stock => stock._id === formData.stockId);
        if (selectedStock) {
          const response = await fetch(
            `http://localhost:5000/api/stocks/stock-items?stockName=${selectedStock.engName}`
          );
          const data = await response.json();
          setStockItems(data);
        }
      } catch (error) {
        toast.error("Failed to load stock items");
      } finally {
        setLoadingStockItems(false);
      }
    };

    fetchStockItems();
  }, [formData.stockId, stocks]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => {
      let updatedData = { ...prev, [field]: value };

      // Auto-calculate total price
      if (["quantity", "unitPerPackage", "unitPrice", "discount"].includes(field)) {
        const { quantity, unitPerPackage, unitPrice, discount } = updatedData;
        const totalPrice = (quantity * unitPerPackage * unitPrice) - (discount || 0);
        updatedData.totalPrice = totalPrice;

        // Update payment fields based on payment method
        if (updatedData.paymentMethod === "credit") {
          updatedData.remainingCash = totalPrice;
          updatedData.givingCash = 0;
        } else if (updatedData.paymentMethod === "cash") {
          updatedData.remainingCash = 0;
          updatedData.givingCash = totalPrice;
        } else if (updatedData.paymentMethod === "cashAndCredit") {
          updatedData.remainingCash = totalPrice - (updatedData.givingCash || 0);
        }
      }

      // Handle payment method changes
      if (field === "paymentMethod") {
        const { totalPrice, givingCash } = updatedData;
        if (value === "credit") {
          updatedData.remainingCash = totalPrice;
          updatedData.givingCash = 0;
        } else if (value === "cash") {
          updatedData.remainingCash = 0;
          updatedData.givingCash = totalPrice;
        } else if (value === "cashAndCredit") {
          updatedData.remainingCash = totalPrice - (givingCash || 0);
        }
      }

      // Handle giving cash changes for cashAndCredit
      if (field === "givingCash" && updatedData.paymentMethod === "cashAndCredit") {
        updatedData.remainingCash = updatedData.totalPrice - value;
      }

      // Set unitPerPackage = 1 for specific unit types
      if (field === "unitType" && ["kg", "piece", "liter"].includes(value)) {
        updatedData.unitPerPackage = 1;
      }

      return updatedData;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.stockId) {
      toast.error("Please select a stock");
      return;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (!formData.unitPrice || formData.unitPrice <= 0) {
      toast.error("Please enter a valid unit price");
      return;
    }

    try {
      const saleData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalPrice: parseFloat(formData.totalPrice),
        discount: parseFloat(formData.discount || 0),
        givingCash: parseFloat(formData.givingCash || 0),
        remainingCash: parseFloat(formData.remainingCash || 0),
      };

      if (isEdit) {
        await dispatch(updateSaleAsync({ saleId: id, saleData })).unwrap();
        toast.success("Sale updated successfully");
      } else {
        await dispatch(createSaleAsync(saleData)).unwrap();
        toast.success("Sale created successfully");
      }

      navigate("/sales");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    navigate("/sales");
  };

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Credit" },
    { value: "cashAndCredit", label: "Cash & Credit" },
  ];

  const unitTypes = ["kg", "piece", "carton", "liter", "dozen"];

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
              {isEdit ? "Edit Sale" : "Create New Sale"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit ? "Update sale information" : "Add a new sale transaction"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Back to Sales
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
            {/* Sale Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sale Number"
                name="saleNumber"
                value={formData.saleNumber}
                onChange={handleChange("saleNumber")}
                fullWidth
                disabled
                size="small"
              />
            </Grid>

            {/* Customer */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Customer"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange("customerId")}
                fullWidth
                required
                size="small"
              >
                {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Stock */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Stock"
                name="stockId"
                value={formData.stockId}
                onChange={handleChange("stockId")}
                fullWidth
                required
                size="small"
              >
                {stocks.map((stock) => (
                  <MenuItem key={stock._id} value={stock._id}>
                    {stock.engName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Stock Item */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Stock Item"
                name="stockItemId"
                value={formData.stockItemId}
                onChange={handleChange("stockItemId")}
                fullWidth
                required
                disabled={!formData.stockId || loadingStockItems}
                size="small"
              >
                {stockItems.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Quantity */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange("quantity")}
                fullWidth
                required
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Unit Type */}
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Unit Type"
                name="unitType"
                value={formData.unitType}
                onChange={handleChange("unitType")}
                fullWidth
                required
                size="small"
              >
                {unitTypes.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Unit Per Package */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Unit Per Package"
                name="unitPerPackage"
                type="number"
                value={formData.unitPerPackage}
                onChange={handleChange("unitPerPackage")}
                fullWidth
                required
                size="small"
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>

            {/* Unit Price */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Unit Price"
                name="unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={handleChange("unitPrice")}
                fullWidth
                required
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Discount */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange("discount")}
                fullWidth
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Total Price */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Price"
                name="totalPrice"
                value={formData.totalPrice}
                fullWidth
                disabled
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange("paymentMethod")}
                fullWidth
                required
                size="small"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Giving Cash */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Giving Cash"
                name="givingCash"
                type="number"
                value={formData.givingCash}
                onChange={handleChange("givingCash")}
                fullWidth
                disabled={formData.paymentMethod === "credit"}
                size="small"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Remaining Cash */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Remaining Cash"
                name="remainingCash"
                value={formData.remainingCash}
                fullWidth
                disabled
                size="small"
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
                    ? "Update Sale"
                    : "Create Sale"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateSale;
