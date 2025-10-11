import React, { useState, useEffect, useMemo } from "react";
import {
  Grid2 as Grid,
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
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
    saleNumber: "SALE-2025-0012",
    customerId: "CUST-1024",
    items: [
      {
        stockId: "STOCK-001",
        stockItemId: "ITEM-001-A",
        quantity: 5,
        unitType: "kg",
        unitPerPackage: 10,
        unitPrice: 200,
        discount: 20,
      },
      {
        stockId: "STOCK-002",
        stockItemId: "ITEM-002-B",
        quantity: 3,
        unitType: "pcs",
        unitPerPackage: 1,
        unitPrice: 1500,
        discount: 0,
      },
    ],
    paymentMethod: "cash",
    givingCash: 6000,
    remainingCash: 500,
    description: "Sale to regular customer — includes rice and LED bulbs.",
  });

  const [stockItems, setStockItems] = useState({});
  const [loadingStockItems, setLoadingStockItems] = useState({});

  // Load sale data for edit mode
  // useEffect(() => {
  //   if (isEdit && id) {
  //     dispatch(fetchSaleByIdAsync(id));
  //   } else {
  //     // Load next sale number for create mode
  //     dispatch(fetchNextSaleNumberAsync());
  //   }
  // }, [dispatch, isEdit, id]);

  // Update form data when selected sale changes (edit mode)
  // useEffect(() => {
  //   if (isEdit && selectedSale) {
  //     setFormData({
  //       saleNumber: selectedSale.saleNumber || "",
  //       customerId: selectedSale.customerId || "",
  //       items: selectedSale.items?.length
  //         ? selectedSale.items.map((it) => ({
  //             stockId: it.stockId || "",
  //             stockItemId: it.stockItemId || "",
  //             quantity: it.quantity || "",
  //             unitType: it.unitType || "kg",
  //             unitPerPackage: it.unitPerPackage || "",
  //             unitPrice: it.unitPrice || "",
  //             discount: it.discount || 0,
  //           }))
  //         : [
  //             {
  //               stockId: "",
  //               stockItemId: "",
  //               quantity: "",
  //               unitType: "kg",
  //               unitPerPackage: "",
  //               unitPrice: "",
  //               discount: 0,
  //             },
  //           ],
  //       paymentMethod: selectedSale.paymentMethod || "cash",
  //       givingCash: selectedSale.givingCash || "",
  //       remainingCash: selectedSale.remainingCash || "",
  //       description: selectedSale.description || "",
  //     });
  //   } else if (!isEdit && nextSaleNumber) {
  //     setFormData(prev => ({
  //       ...prev,
  //       saleNumber: nextSaleNumber.toString(),
  //     }));
  //   }
  // }, [isEdit, selectedSale, nextSaleNumber]);

  const ensureStockItemsLoaded = async (stockId) => {
    if (!stockId) return;
    if (stockItems[stockId]) return;
    setLoadingStockItems((prev) => ({ ...prev, [stockId]: true }));
    try {
      const selectedStock = stocks.find((stock) => stock._id === stockId);
      if (selectedStock) {
        const response = await fetch(
          `http://localhost:5000/api/stocks/stock-items?stockName=${selectedStock.engName}`
        );
        const data = await response.json();
        setStockItems((prev) => ({ ...prev, [stockId]: data }));
      }
    } catch (error) {
      toast.error("Failed to load stock items");
    } finally {
      setLoadingStockItems((prev) => ({ ...prev, [stockId]: false }));
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      let updatedData = { ...prev, [field]: value };

      const total = grandTotal;
      if (field === "paymentMethod") {
        if (value === "credit") {
          updatedData.remainingCash = total;
          updatedData.givingCash = 0;
        } else if (value === "cash") {
          updatedData.remainingCash = 0;
          updatedData.givingCash = total;
        } else if (value === "cashAndCredit") {
          updatedData.remainingCash = total - (updatedData.givingCash || 0);
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
      if (
        field === "givingCash" &&
        updatedData.paymentMethod === "cashAndCredit"
      ) {
        updatedData.remainingCash = total - value;
      }

      return updatedData;
    });
  };

  const handleItemChange = (index, field) => async (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const items = [...prev.items];
      const updatedItem = { ...items[index], [field]: value };
      if (field === "unitType" && ["kg", "piece", "liter"].includes(value)) {
        updatedItem.unitPerPackage = 1;
      }
      items[index] = updatedItem;
      return { ...prev, items };
    });
    if (field === "stockId") {
      await ensureStockItemsLoaded(event.target.value);
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          stockId: "",
          stockItemId: "",
          quantity: "",
          unitType: "kg",
          unitPerPackage: "",
          unitPrice: "",
          discount: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const lineTotal = (item) => {
    const q = Number(item.quantity) || 0;
    const upp = Number(item.unitPerPackage) || 0;
    const up = Number(item.unitPrice) || 0;
    const d = Number(item.discount) || 0;
    return q * upp * up - d;
  };

  const grandTotal = useMemo(
    () => formData.items.reduce((sum, it) => sum + lineTotal(it), 0),
    [formData.items]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return;
    }
    const invalid = formData.items.some(
      (it) =>
        !it.stockId ||
        !it.stockItemId ||
        !(Number(it.quantity) > 0) ||
        !(Number(it.unitPrice) > 0)
    );
    if (invalid) {
      toast.error("Please fill all product rows correctly");
      return;
    }

    try {
      const saleData = {
        saleNumber: formData.saleNumber,
        customerId: formData.customerId,
        items: formData.items.map((it) => ({
          stockId: it.stockId,
          stockItemId: it.stockItemId,
          quantity: Number(it.quantity),
          unitType: it.unitType,
          unitPerPackage: Number(it.unitPerPackage),
          unitPrice: Number(it.unitPrice),
          discount: Number(it.discount || 0),
          totalPrice: lineTotal(it),
        })),
        totalPrice: grandTotal,
        paymentMethod: formData.paymentMethod,
        givingCash: Number(formData.givingCash || 0),
        remainingCash: Number(formData.remainingCash || 0),
        description: formData.description,
      };

      // if (isEdit) {
      //   await dispatch(updateSaleAsync({ saleId: id, saleData })).unwrap();
      //   toast.success("Sale updated successfully");
      // } else {
      //   await dispatch(createSaleAsync(saleData)).unwrap();
      //   toast.success("Sale created successfully");
      // }

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
              {isEdit
                ? "Update sale information"
                : "Add a new sale transaction"}
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
          <Grid container spacing={2} sx={{ marginTop: "15px" }}>
            <Grid size={12} xs={12} sx={{ textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Sale #{formData.saleNumber}
              </Typography>
            </Grid>

            {/* Customer */}
            {/* <Grid item xs={12} sm={6} size={12}> */}
            <Grid size={12} xs={12} sm={6}>
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
            <Grid size={12} xs={12}>
              <Divider>
                <Typography variant="subtitle1">Products</Typography>
              </Divider>
            </Grid>

            {formData.items.map((it, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  // border: "1px solid #ddd",
                  // borderRadius: 2,
                  borderRIghtColor: "divider",
                  borderLeftColor: "divider",
                  p: 2,
                  mb: 2,
                  "&:hover .delete-icon": {
                    opacity: 1,
                  },
                }}
              >
                {/* Delete Icon */}
                <IconButton
                  className="delete-icon"
                  onClick={() => removeItem(idx)}
                  disabled={formData.items.length === 1}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "-15px",
                    transform: "translateY(-50%)",
                    bgcolor: "white",
                    color: "red",
                    boxShadow: 2,
                    opacity: 0,
                    transition: "opacity 0.3s",
                    zIndex: 10,
                    "&:hover": { bgcolor: "#ffe6e6" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>

                {/* Main Grid Content */}
                <Grid container spacing={1}>
                  {/* Row 1 */}
                  <Grid size={3} xs={12} sm={6}>
                    <TextField
                      select
                      label="Stock"
                      name={`stockId-${idx}`}
                      value={it.stockId}
                      onChange={handleItemChange(idx, "stockId")}
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

                  <Grid size={3} xs={12} sm={6}>
                    <TextField
                      select
                      label="Stock Item"
                      name={`stockItemId-${idx}`}
                      value={it.stockItemId}
                      onChange={handleItemChange(idx, "stockItemId")}
                      fullWidth
                      required
                      disabled={!it.stockId || loadingStockItems[it.stockId]}
                      size="small"
                    >
                      {(stockItems[it.stockId] || []).map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={3} xs={12} sm={6}>
                    <TextField
                      label="Quantity"
                      name={`quantity-${idx}`}
                      type="number"
                      value={it.quantity}
                      onChange={handleItemChange(idx, "quantity")}
                      fullWidth
                      required
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>

                  <Grid size={3} xs={12} sm={6}>
                    <TextField
                      select
                      label="Unit Type"
                      name={`unitType-${idx}`}
                      value={it.unitType}
                      onChange={handleItemChange(idx, "unitType")}
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

                  {/* Row 2 */}
                  <Grid size={3} xs={12} sm={6}>
                    <TextField
                      label="Unit Per Package"
                      name={`unitPerPackage-${idx}`}
                      type="number"
                      value={it.unitPerPackage}
                      onChange={handleItemChange(idx, "unitPerPackage")}
                      fullWidth
                      required
                      size="small"
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid>

                  <Grid size={3} xs={12} sm={6}>
                    <TextField
                      label="Unit Price"
                      name={`unitPrice-${idx}`}
                      type="number"
                      value={it.unitPrice}
                      onChange={handleItemChange(idx, "unitPrice")}
                      fullWidth
                      required
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>

                  <Grid size={3} xs={12} sm={6}>
                    <TextField
                      label="Line Total"
                      name={`lineTotal-${idx}`}
                      value={lineTotal(it)}
                      fullWidth
                      disabled
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Grid size={12} xs={12}>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addItem}
                fullWidth
              >
                Add Product
              </Button>
            </Grid>

            <Grid size={12} xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid size={12} container xs={12} sm={6}>
              <Grid size={3} xs={12} sm={3}>
                <TextField
                  label="Grand Total"
                  name="grandTotal"
                  value={grandTotal}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>

              <Grid size={3} xs={12} sm={3}>
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
              <Grid size={3} xs={12} sm={3}>
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
              <Grid size={3} xs={12} sm={3}>
                <TextField
                  label="Remaining Cash"
                  name="remainingCash"
                  value={formData.remainingCash}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>
              <Grid size={12} xs={12}>
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
            </Grid>

            {/* Action Buttons */}
            <Grid container xs={12}>
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
                    createLoading || updateLoading ? (
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
