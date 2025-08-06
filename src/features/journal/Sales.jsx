import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Grid, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { useDispatch, useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectCustomers } from "../../store/selectors/businessEntity.selector";
import { selectStocks } from "../../store/selectors/stock.selector";
import { InputAdornment, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { fetchSalesAsync } from "../../store/slices/sale.slice";

// unit types for purchase component
const unitTypes = ["kg", "piece", "carton", "liter", "dozen"];
const paymentMethods = ["cash", "credit", "cashAndCredit"];

const Sales = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const selectedDirection = useSelector(selectDirection);
  const customers = useSelector(selectCustomers).customers;
  const stocks = useSelector(selectStocks).stocks;
  const [sale, setSale] = useState({
    unitType: "",
    unitPerPackage: "",
    unitPrice: "",
    totalPrice: "",
    paymentMethod: "",
    givingCash: "",
    remainingCash: "",
    invoiceNo: "",
    customerId: "",
    discount: 0,
    quantity: "",
    unitPerPackage: "",
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

  // handle input changes
  const inputHandler = (event) => {
    const { name, value } = event.target;

    setSale((prevState) => {
      let updatedSale = { ...prevState, [name]: value };
      const {
        discount,
        givingCash,
        quantity,
        unitPerPackage,
        unitPrice,
        unitType,
        paymentMethod,
      } = updatedSale;

      // Set unitPerPackage = 1 for specific unit types
      if (["kg", "piece", "liter"].includes(unitType)) {
        updatedSale.unitPerPackage = 1;
      }

      const totalPrice = quantity * unitPerPackage * unitPrice - discount;
      updatedSale.totalPrice = totalPrice;

      if (paymentMethod === "credit") {
        updatedSale.remainingCash = totalPrice;
        updatedSale.givingCash = 0;
      } else if (paymentMethod === "cash") {
        updatedSale.remainingCash = 0;
        updatedSale.givingCash = totalPrice;
      } else if (paymentMethod === "cashAndCredit") {
        updatedSale.remainingCash = totalPrice - givingCash;
      }

      return updatedSale;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    const cleanedSale = { ...sale };

    delete cleanedSale.productId;
    delete cleanedSale.productName;
    delete cleanedSale.invoiceNo;

    try {
      await axios.post(`http://localhost:5000/api/sales`, cleanedSale, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(fetchSalesAsync());
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
                  <TextField
                    fullWidth
                    required
                    label={t("Quantity")}
                    name="quantity"
                    type="number"
                    value={sale.quantity}
                    onChange={inputHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    required
                    name="unitType"
                    label={t("unitType")}
                    style={{ minWidth: "200px" }}
                    dir={selectedDirection === "rtl" ? "right" : "left"}
                    value={sale.unitType}
                    onChange={inputHandler}
                  >
                    {unitTypes.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {t(`${item}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    disabled={
                      sale.unitType === "kg" ||
                      sale.unitType === "piece" ||
                      sale.unitType === "liter"
                    }
                    label={t("unitPerPackage")}
                    name="unitPerPackage"
                    type="number"
                    value={sale.unitPerPackage}
                    onChange={inputHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label={t("unitPrice")}
                    name="unitPrice"
                    type="number"
                    value={sale.unitPrice}
                    onChange={inputHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    disabled
                    label={t("totalPrice")}
                    name="totalPrice"
                    type="number"
                    value={sale.totalPrice}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    required
                    name="paymentMethod"
                    label={t("paymentMethod")}
                    style={{ minWidth: "200px" }}
                    dir={selectedDirection === "rtl" ? "right" : "left"}
                    value={sale.paymentMethod}
                    onChange={inputHandler}
                  >
                    {paymentMethods.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {t(`${item}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    disabled={
                      sale.paymentMethod === "cash" ||
                      sale.paymentMethod === "credit"
                    }
                    label={t("givingCash")}
                    name="givingCash"
                    type="number"
                    value={sale.givingCash}
                    onChange={inputHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    disabled
                    label={t("remainingCash")}
                    name="remainingCash"
                    type="number"
                    value={sale.remainingCash}
                    onChange={inputHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={t("discount")}
                    name="discount"
                    type="number"
                    value={sale.discount}
                    onChange={inputHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={t("invoiceNo")}
                    name="invoiceNo"
                    type="number"
                    value={1}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={8}>
                  <TextField
                    select
                    fullWidth
                    required
                    name="customerId"
                    label={t("customer")}
                    style={{ minWidth: "200px" }}
                    dir={selectedDirection === "rtl" ? "right" : "left"}
                    value={sale.customerId}
                    onChange={inputHandler}
                  >
                    {customers.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {t(`${item.name}`)}-#{t(`${item.address}`)}-#
                        {t(`${item.phone}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
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
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default Sales;
