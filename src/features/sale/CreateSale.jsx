import React, { useState, useMemo } from "react";
import {
  Grid2 as Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
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
import {
  fetchNextSaleNumberAsync,
  fetchSalesAsync,
} from "../../store/slices/sale.slice";
import {
  selectCreateSaleLoading,
  selectUpdateSaleLoading,
} from "../../store/selectors/sale.selectors";
import { selectCustomers } from "../../store/selectors/businessEntity.selector";
import { selectStocks } from "../../store/selectors/stock.selector";
import COLORS from "../../constant/colors";
import { toast, ToastContainer } from "react-toastify";
import { fetchReceivablesAsync } from "../../store/slices/receivable.slice";
import axios from "axios";
import { PAYMENT_METHODS } from "../../constant/variables";
import { selectUnits } from "../../store/selectors/unit.selector";

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "credit", label: "Credit" },
  { value: "cashAndCredit", label: "Cash & Credit" },
];

const CreateSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const createLoading = useSelector(selectCreateSaleLoading);
  const updateLoading = useSelector(selectUpdateSaleLoading);
  const customers = useSelector(selectCustomers).customers;
  const stocks = useSelector(selectStocks).stocks;

  const units = useSelector(selectUnits);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    customerId: "",
    items: [
      {
        stockId: "",
        stockItemId: "",
        quantity: 5,
        unitPrice: 200,
        productId: "",
      },
    ],
    paymentMethod: "cash",
    givingCash: 0,
    remainingCash: 0,
    discount: 0,
    description: "Sale to regular customer — includes rice and LED bulbs.",
  });

  const [stockItems, setStockItems] = useState({});
  const [loadingStockItems, setLoadingStockItems] = useState({});

  const ensureStockItemsLoaded = async (stockId) => {
    if (!stockId) return;
    if (stockItems[stockId]) return;
    setLoadingStockItems((prev) => ({ ...prev, [stockId]: true }));
    try {
      const selectedStock = stocks.find((stock) => stock._id === stockId);
      if (selectedStock) {
        const response = await fetch(
          `http://localhost:5000/api/stocks/${stockId}/stock-items`
        );
        const data = await response.json();
        console.log({ data });
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
      return updatedData;
    });
  };

  const handleItemChange = (index, field) => async (event) => {
    const value = event.target.value;

    setFormData((prev) => {
      const items = [...prev.items];
      const updatedItem = { ...items[index], [field]: value };
      // if (["kg", "piece", "liter"].includes(updatedItem.unitType)) {
      //   updatedItem.unitPerPackage = 1;
      // }

      if (field === "stockItemId") {
        const selectedStockItem = (stockItems[updatedItem.stockId] || []).find(
          (item) => item._id === value
        );
        if (selectedStockItem) {
          updatedItem.productId = selectedStockItem.productId;
        } else {
          updatedItem.productId = "";
        }
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
          unitTypeId: "",
          unitPerPackage: "",
          unitPrice: "",
          productId: "",
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
    const up = Number(item.unitPrice) || 0;
    const d = Number(item.discount) || 0;
    return q * up - d;
  };

  const grandTotal = useMemo(() => {
    const subtotal = formData.items.reduce((sum, it) => sum + lineTotal(it), 0);
    return subtotal;
  }, [formData.items]);

  const totalDue = useMemo(() => {
    const discount = Number(formData.discount) || 0;
    return Math.max(grandTotal - discount, 0);
  }, [grandTotal, formData.discount]);

  const givingCashComputed = useMemo(() => {
    if (formData.paymentMethod === PAYMENT_METHODS.CASH) {
      return totalDue;
    }
    if (formData.paymentMethod === PAYMENT_METHODS.CREDIT) {
      return 0;
    }
    const userGiving = Number(formData.givingCash) || 0;
    return Math.min(Math.max(userGiving, 0), totalDue);
  }, [formData.paymentMethod, formData.givingCash, totalDue]);

  const remainingCashComputed = useMemo(() => {
    if (formData.paymentMethod === PAYMENT_METHODS.CASH) {
      return 0;
    }
    if (formData.paymentMethod === PAYMENT_METHODS.CREDIT) {
      return totalDue;
    }
    return Math.max(totalDue - givingCashComputed, 0);
  }, [formData.paymentMethod, totalDue, givingCashComputed]);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        customerId: formData.customerId === "" ? null : formData.customerId,
        items: formData.items.map((it) => ({
          stockItemId: it.stockItemId,
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
          totalPrice: lineTotal(it),
        })),
        totalPrice: grandTotal,
        paymentMethod: formData.paymentMethod,
        givingCash: Number(givingCashComputed || 0),
        remainingCash: Number(remainingCashComputed || 0),
        description: formData.description,
        discount: formData.discount,
      };

      await axios.post(`http://localhost:5000/api/sales`, saleData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("data added");
      dispatch(fetchSalesAsync({ limit: 10, page: 1 }));
      dispatch(fetchReceivablesAsync());
      dispatch(fetchNextSaleNumberAsync());
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  const handleCancel = () => {
    navigate("/sales");
  };

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
        <ToastContainer />
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
                Sale #abc123
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
                size="small"
              >
                {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    <Typography variant="body1">
                      {`${customer.name}    &   `}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {`  ${customer.address}`}
                    </Typography>
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
              <Grid
                key={idx}
                size={12}
                sx={{
                  position: "relative",
                  // border: "1px solid #ddd",
                  // borderRadius: 2,
                  borderRIghtColor: "divider",
                  borderLeftColor: "divider",
                  // p: 2,
                  // mb: 2,
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
                  <Grid size={2.4} xs={12} sm={6}>
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

                  <Grid size={2.4} xs={12} sm={6}>
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
                          <Typography variant="body1">
                            {`${item.productId.name} `}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            quantity:
                            {`${item.availableQty} ${item?.productId?.baseUnitId?.engName}`}
                          </Typography>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={2.4} xs={12} sm={6}>
                    <TextField
                      label="Quantity"
                      type="number"
                      name={`quantity-${idx}`}
                      value={it.quantity}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        const selectedItem = (
                          stockItems[it.stockId] || []
                        ).find((item) => item._id === it.stockItemId);

                        const maxQuantity = selectedItem
                          ? selectedItem.availableQty
                          : Infinity;

                        // Update state and set error if needed
                        handleItemChange(idx, "quantity")(e);
                        if (newQuantity > maxQuantity) {
                          setFormErrors((prev) => ({
                            ...prev,
                            [idx]: `Max available quantity is ${maxQuantity}`,
                          }));
                        } else {
                          setFormErrors((prev) => ({ ...prev, [idx]: "" }));
                        }
                      }}
                      fullWidth
                      required
                      size="small"
                      inputProps={{
                        min: 0,
                        step: 0.01,
                      }}
                      error={Boolean(formErrors[idx])}
                      helperText={formErrors[idx] || ""}
                    />
                  </Grid>

                  {/* <Grid size={3} xs={12} sm={6}>
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
                      {units.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit.engName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid> */}

                  {/* Row 2 */}
                  {/* <Grid size={3} xs={12} sm={6}>
                    <TextField
                      label="Unit Per Package"
                      name={`unitPerPackage-${idx}`}
                      type="number"
                      value={it.unitPerPackage}
                      onChange={handleItemChange(idx, "unitPerPackage")}
                      fullWidth
                      required
                      size="small"
                      disabled={["kg", "piece", "liter"].includes(it.unitType)}
                      inputProps={{ min: 1, step: 1 }}
                    />
                  </Grid> */}

                  <Grid size={2.4} xs={12} sm={6}>
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

                  <Grid size={2.4} xs={12} sm={6}>
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
              </Grid>
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
              <Grid size={2.5} xs={12} sm={3}>
                <TextField
                  label="Grand Total"
                  name="grandTotal"
                  value={grandTotal}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid>

              <Grid size={2.5} xs={12} sm={3}>
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
              <Grid size={2.5} xs={12} sm={3}>
                <TextField
                  label="Giving Cash"
                  name="givingCash"
                  type="number"
                  value={
                    [PAYMENT_METHODS.CASH, PAYMENT_METHODS.CREDIT].includes(
                      formData.paymentMethod
                    )
                      ? givingCashComputed
                      : formData.givingCash
                  }
                  onChange={handleChange("givingCash")}
                  fullWidth
                  disabled={["cash", "credit"].includes(formData.paymentMethod)}
                  size="small"
                />
              </Grid>
              <Grid size={2.5} xs={12} sm={3}>
                <TextField
                  label="Remaining Cash"
                  name="remainingCash"
                  value={remainingCashComputed}
                  fullWidth
                  disabled
                  type="number"
                  size="small"
                />
              </Grid>
              <Grid size={2} xs={12} sm={3}>
                <TextField
                  label="Discount"
                  name="discount"
                  value={formData.discount}
                  fullWidth
                  type="number"
                  onChange={handleChange("discount")}
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
