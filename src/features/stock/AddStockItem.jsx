import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Autocomplete,
  MenuItem,
  Stack,
} from "@mui/material";
import { useParams, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import COLORS from "../../constant/colors";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectProducts } from "../../store/selectors/product.selector";
import { fetchProductsAsync } from "../../store/slices/product.slice";

const AddStockItem = () => {
  const { t } = useTranslation();
  const { id: stockId } = useParams();
  const dispatch = useDispatch();
  const selectedDirection = useSelector(selectDirection);
  const products = useSelector(selectProducts);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    unitType: "",
    stockNotificationQuantity: "",
    purchasePrice: "",
  });

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProductsAsync({ page: 1, limit: 1000 })); // Fetch all products
  }, [dispatch]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.productId || !formData.quantity || !formData.unitType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:5000/api/stocks/${stockId}/stock-items`,
        {
          productId: formData.productId,
          quantity: parseFloat(formData.quantity),
          unitType: formData.unitType,
          stockNotificationQuantity:
            parseFloat(formData.stockNotificationQuantity) || 0,
          purchasePrice: parseFloat(formData.purchasePrice) || 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Item added to stock successfully");

      // Reset form
      setFormData({
        productId: "",
        quantity: "",
        unitType: "",
        stockNotificationQuantity: "",
        purchasePrice: "",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const unitTypes = [
    { value: "piece", label: "Piece" },
    { value: "kg", label: "Kilogram" },
    { value: "gram", label: "Gram" },
    { value: "liter", label: "Liter" },
    { value: "meter", label: "Meter" },
    { value: "box", label: "Box" },
    { value: "pack", label: "Pack" },
    { value: "dozen", label: "Dozen" },
  ];

  return (
    <>
      <ToastContainer />
      <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Add New Item to Stock
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Product Selection */}
            <Grid item xs={12}>
              <Autocomplete
                options={products.products || []}
                getOptionLabel={(option) => option.name || ""}
                value={
                  products.products?.find(
                    (p) => p._id === formData.productId
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange("productId", newValue?._id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Product *"
                    required
                    fullWidth
                    placeholder="Search and select a product"
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {option.sku} | Category: {option.categoryName}
                      </Typography>
                    </Box>
                  </Box>
                )}
                isOptionEqualToValue={(option, value) =>
                  option._id === value?._id
                }
              />
            </Grid>

            {/* Quantity and Unit Type */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity *"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Unit Type *"
                value={formData.unitType}
                onChange={(e) => handleChange("unitType", e.target.value)}
                required
              >
                {unitTypes.map((unit) => (
                  <MenuItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Stock Notification Quantity */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock Notification Quantity"
                type="number"
                value={formData.stockNotificationQuantity}
                onChange={(e) =>
                  handleChange("stockNotificationQuantity", e.target.value)
                }
                helperText="Minimum quantity before notification"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Purchase Price */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Purchase Price"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleChange("purchasePrice", e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Supplier */}
            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                label="Supplier"
                value={formData.supplier}
                onChange={(e) => handleChange("supplier", e.target.value)}
                placeholder="Enter supplier name (optional)"
              />
            </Grid> */}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? COLORS.WHITE
                        : COLORS.PURPLE,
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.BLACK
                        : COLORS.WHITE,
                    minWidth: 120,
                  })}
                >
                  {loading ? "Adding..." : "Add Item"}
                </Button>

                <NavLink to={`/stocks/${stockId}/stock-items`}>
                  <Button variant="outlined" sx={{ minWidth: 120 }}>
                    Cancel
                  </Button>
                </NavLink>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AddStockItem;
