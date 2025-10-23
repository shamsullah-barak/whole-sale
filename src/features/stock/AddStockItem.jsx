import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid2 as Grid,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";
import { useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import COLORS from "../../constant/colors";
import { selectProductsList } from "../../store/selectors/product.selector";
import { fetchProductsAsync } from "../../store/slices/product.slice";
import { selectUnits } from "../../store/selectors/unit.selector";

const AddStockItem = () => {
  const { id: stockId } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectProductsList);
  const units = useSelector(selectUnits);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    unitTypeId: "",
    unitPerPackage: 1,
    unitPrice: "",
  });

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProductsAsync({ page: 1, limit: 1000 })); // Fetch all products
  }, [dispatch]);

  // Helper function to get selected product
  const getSelectedProduct = () => {
    return products.find((p) => p._id === formData.productId);
  };

  // Helper function to check if selected unit is different from base unit
  const isUnitDifferentFromBase = () => {
    const selectedProduct = getSelectedProduct();
    return (
      selectedProduct && selectedProduct.baseUnitId?._id !== formData.unitTypeId
    );
  };

  // Helper function to calculate total quantity
  const calculateTotalQuantity = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const unitPerPackage = parseFloat(formData.unitPerPackage) || 1;

    if (isUnitDifferentFromBase()) {
      return quantity * unitPerPackage;
    }
    return quantity;
  };

  // Helper function to get base unit name
  const getBaseUnitName = () => {
    const selectedProduct = getSelectedProduct();
    return selectedProduct?.baseUnitId?.engName || "";
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // If unitTypeId changes and it's different from base unit, reset unitPerPackage
      if (field === "unitTypeId" || field === "productId") {
        const selectedProduct = products.find(
          (p) => p._id === updated.productId
        );
        const isBaseUnit =
          selectedProduct && selectedProduct.baseUnitId?._id === value;
        if (isBaseUnit) {
          updated.unitPerPackage = "";
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // const totalQty =
    const data = {
      quantity: calculateTotalQuantity(),
      productId: formData.productId,
      unitPrice: formData.unitPrice,
    };
    if (!formData.productId || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate unit per package if unit is different from base unit
    if (
      isUnitDifferentFromBase() &&
      (!formData.unitPerPackage || parseFloat(formData.unitPerPackage) <= 0)
    ) {
      toast.error("Please enter a valid units per package value");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:5000/api/stocks/${stockId}/stock-items`,
        data,
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
        unitTypeId: "",
        unitPerPackage: "",
        unitPrice: "",
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

  return (
    <>
      <ToastContainer />
      <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Add New Item to Stock
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12} xs={6}>
              <TextField
                select
                label="Product"
                name={`productId`}
                value={formData.productId}
                onChange={(e) => handleChange("productId", e.target.value)}
                fullWidth
                required
                size="small"
              >
                {products.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    <Typography variant="body1">{`${item.name} `}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Base Unit:
                      {`${item?.baseUnitId?.engName}`}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={4} xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                required
                inputProps={{ min: 0, step: 0.01 }}
                size="small"
              />
            </Grid>

            <Grid size={4} xs={6}>
              <TextField
                fullWidth
                select
                label="Unit Type"
                value={formData.unitTypeId}
                onChange={(e) => handleChange("unitTypeId", e.target.value)}
                size="small"
              >
                {units.map((unit) => (
                  <MenuItem key={unit._id} value={unit._id}>
                    {unit.engName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={4} xs={6}>
              <TextField
                fullWidth
                label="Units Per Package"
                type="number"
                value={formData.unitPerPackage}
                onChange={(e) => handleChange("unitPerPackage", e.target.value)}
                inputProps={{ min: 1, step: 1 }}
                size="small"
                disabled={!isUnitDifferentFromBase()}
              />
            </Grid>

            <Grid size={4} xs={6}>
              <TextField
                fullWidth
                label="Total Quantity"
                value={`${calculateTotalQuantity()} ${getBaseUnitName()}`}
                disabled
                size="small"
              />
            </Grid>

            <Grid size={4} xs={6}>
              <TextField
                fullWidth
                label="unit price"
                type="number"
                value={formData.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
                size="small"
                required
              />
            </Grid>
            <Grid xs={12}>
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
