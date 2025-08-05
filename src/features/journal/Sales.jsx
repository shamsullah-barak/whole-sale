import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Grid, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectCustomers } from "../../store/selectors/businessEntity.selector";
import { selectStocks } from "../../store/selectors/stock.selector";
import { InputAdornment, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

// unit types for purchase component
const unitTypes = ["kg", "piece", "carton", "liter", "dozen"];
const paymentMethods = ["cash", "credit", "cashAndCredit"];

const Sales = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const selectedDirection = useSelector(selectDirection);
  const customers = useSelector(selectCustomers).customers;
  const stocks = useSelector(selectStocks).stocks;
  const [sale, setSale] = useState({
    stockId: "",
    stockName: "",
    quantity: "",
    unitPrice: "",
    totalPrice: "",
    paymentMethod: "",
    customerId: "",
    productId: "",
    productName: "",
    purchaseId: "",
    unitType: "",
  });

  // API call
  useEffect(() => {
    const fetchData = async () => {
      if (!sale.stockName) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/stocks/stock-items?stockName=${sale.stockName}`
        );

        setStockData(res.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ??
            "something went wrong! please try again"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sale.stockName]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = { ...sale, [name]: value };

    if (name === "quantity" || name === "unitPrice") {
      const quantity = parseFloat(updatedData.quantity || 0);
      const price = parseFloat(updatedData.unitPrice || 0);
      updatedData.totalPrice = (quantity * price).toFixed(2);
    }

    setSale(updatedData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    try {
      await axios.post(`http://localhost:5000/api/sales`, sale, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // dispatch(fetchNextInvoiceAsync());
      // dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
      toast.success("data added");
      // clearState();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  const selectProduct = (event) => {
    const { value } = event.target;

    const selected = stockData.find((p) => p._id === value);

    if (selected) {
      const { _id, productName } = selected;

      setSelectedProduct(selected);

      setSale({
        ...sale,
        productId: _id,
        productName: productName,
        purchaseId: selected.purchaseId,
      });
    } else {
      setSelectedProduct(null);
    }
  };

  const selectStock = (event) => {
    const { value } = event.target;
    const stock = stocks.find((s) => s.id === value);

    setSale({ ...sale, stockId: value, stockName: stock.name });
  };

  return (
    <>
      <ToastContainer />
      <Grid xs={12} marginTop={3} sm={12} container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            select
            label="Stock"
            name="stockId"
            value={sale.stockId}
            fullWidth
            required
            type="text"
            onChange={selectStock}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {loading && <CircularProgress size={20} />}
                </InputAdornment>
              ),
            }}
          >
            {stocks.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {sale.stockName && (
          <>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                select
                label="Product"
                name="productId"
                fullWidth
                required
                value={sale.productId || ""}
                onChange={selectProduct}
              >
                {stockData.map((item) => (
                  <MenuItem
                    key={item.productId + item.unitType}
                    value={item._id}
                  >
                    {item.productName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {selectedProduct && (
              <>
                {/* <Grid item xs={12} sm={12} md={12}>
                  <Typography item xs={12} sm={6} md={6}>
                    You have purchased {selectedProduct.quantity}{" "}
                    {selectedProduct.unitType.toLowerCase()} of this product at
                    a unit price of {selectedProduct.unitPrice}, totaling{" "}
                    {selectedProduct.totalPrice}.
                  </Typography>
                </Grid> */}

                <Grid item xs={12} sm={4}>
                  {unitTypes.length > 0 && (
                    <TextField
                      select
                      fullWidth
                      name="unitType"
                      label="unitType"
                      style={{ minWidth: "100px" }}
                      dir={selectedDirection === "rtl" ? "right" : "left"}
                      value={sale.unitType}
                      onChange={handleChange}
                    >
                      {unitTypes.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {t(`${item}`)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="unitPerPackage"
                    label="unitPerPackage"
                    value={sale.unitPerPackage}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="quantity"
                    label="quantity"
                    value={sale.quantity}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="unitPrice"
                    label="Unit Price"
                    value={sale.unitPrice}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="totalPrice"
                    label="Total Price"
                    value={sale.totalPrice}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    name="paymentMethod"
                    label="paymentMethod"
                    value={sale.paymentMethod}
                    onChange={handleChange}
                    fullWidth
                    required
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>
                        {t(`${method}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    required
                    name="customerId"
                    label={t("customer")}
                    style={{ minWidth: "200px" }}
                    dir={selectedDirection === "rtl" ? "right" : "left"}
                    value={sale.customerId}
                    onChange={handleChange}
                  >
                    {customers.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {t(`${item.name}`)}-#{t(`${item.address}`)}-#
                        {t(`${item.phone}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="inherit"
                  style={{ marginTop: 20 }}
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? COLORS.WHITE
                        : COLORS.PURPLE,
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.BLACK
                        : COLORS.WHITE,
                  })}
                  onClick={handleSubmit}
                >
                  {t("Add")}
                </Button>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default Sales;
