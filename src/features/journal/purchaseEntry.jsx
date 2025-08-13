import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  MenuItem,
  Button,
  Grid2 as Grid,
  Autocomplete,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { selectProducts } from "../../store/selectors/product.selector";
import { ToastContainer, toast } from "react-toastify";
import { selectStocks } from "../../store/selectors/stock.selector";
import moment from "moment/moment";
import { selectSuppliers } from "../../store/selectors/businessEntity.selector";
import { fetchNextInvoiceAsync } from "../../store/slices/purchase.slice";
import { selectNextInvoiceNo } from "../../store/selectors/purchase.selector";

// unit types for purchase component
const unitTypes = ["kg", "piece", "carton", "liter", "dozen"];
const paymentMethods = ["cash", "credit", "cashAndCredit"];

const PurchaseOfGoods = ({ statusId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const journals = useSelector(selectJournals);
  const nextInvoiceNo = useSelector(selectNextInvoiceNo);
  const stocks = useSelector(selectStocks).stocks;
  const products = useSelector(selectProducts).products;
  const suppliers = useSelector(selectSuppliers).suppliers;
  const selectedDirection = useSelector(selectDirection);
  const [journalEntry, setJournalEntry] = useState({
    productId: "",
    expiryDate: "",
    quantity: "",
    unitType: "kg",
    unitPerPackage: "",
    unitPrice: "",
    totalPrice: "",
    paymentMethod: "cash",
    invoiceNo: "",
    stockName: "",
    discount: 0,
    givingCash: 0,
    remainingCash: 0,
    supplierId: "",
    purchaseDate: moment().format("YYYY-MM-DD"),
  });

  const clearState = () => {
    setJournalEntry({
      productId: "",
      expiryDate: "",
      quantity: "",
      unitType: "",
      unitPerPackage: "",
      unitPrice: "",
      totalPrice: "",
      paymentMethod: "",
      invoiceNo: "",
      stockName: "",
      stockId: "",
      discount: 0,
      givingCash: 0,
      remainingCash: 0,
      purchaseDate: moment().format("YYYY-MM-DD"),
    });
  };

  // handle input changes
  const inputHandler = (event) => {
    const { name, value } = event.target;

    setJournalEntry((prevState) => {
      let updatedEntry = { ...prevState, [name]: value };
      const {
        discount,
        givingCash,
        quantity,
        unitPerPackage,
        unitPrice,
        unitType,
        paymentMethod,
      } = updatedEntry;

      // Set unitPerPackage = 1 for specific unit types
      if (["kg", "piece", "liter"].includes(unitType)) {
        updatedEntry.unitPerPackage = 1;
      }

      const totalPrice = quantity * unitPerPackage * unitPrice - discount;
      updatedEntry.totalPrice = totalPrice;

      if (paymentMethod === "credit") {
        updatedEntry.remainingCash = totalPrice;
        updatedEntry.givingCash = 0;
      } else if (paymentMethod === "cash") {
        updatedEntry.remainingCash = 0;
        updatedEntry.givingCash = totalPrice;
      } else if (paymentMethod === "cashAndCredit") {
        updatedEntry.remainingCash = totalPrice - givingCash;
      }

      return updatedEntry;
    });
  };

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);

    const cleanedEntry = { ...journalEntry };

    if (!cleanedEntry.expiryDate) delete cleanedEntry.expiryDate;
    if (!cleanedEntry.purchaseDate) delete cleanedEntry.purchaseDate;
    if (!cleanedEntry.invoiceNo) delete cleanedEntry.invoiceNo;

    try {
      await axios.post(
        `http://localhost:5000/api/purchases?transactionTypeId=${statusId}`,
        cleanedEntry,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchNextInvoiceAsync());
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
      toast.success("data added");
      // clearState();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} sx={{ marginTop: "15px" }}>
        <Grid size={6} xs={12} sm={12}>
          <Autocomplete
            disablePortal
            disableClearable
            options={products}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("Products")}
                variant="outlined"
                required
              />
            )}
            onChange={(event, value) => {
              if (value) {
                setJournalEntry({ ...journalEntry, productId: value.id });
              }
            }}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("expiryDate")}
            name="expiryDate"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={journalEntry.expiryDate}
            onChange={inputHandler}
            sx={{ height: "100%", width: "100%" }}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("purchaseDate")}
            name="purchaseDate"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={journalEntry.purchaseDate}
            onChange={inputHandler}
            sx={{ height: "100%", width: "100%" }}
          />
        </Grid>
        <Grid size={4} xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label={t("Quantity")}
            name="quantity"
            type="number"
            value={journalEntry.quantity}
            onChange={inputHandler}
          />
        </Grid>
        <Grid size={4} xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="unitType"
            label={t("unitType")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.unitType}
            onChange={inputHandler}
          >
            {unitTypes.map((item, index) => (
              <MenuItem key={index} value={item}>
                {t(`${item}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={4} xs={12} sm={6}>
          <TextField
            fullWidth
            required
            disabled={
              journalEntry.unitType === "kg" ||
              journalEntry.unitType === "piece" ||
              journalEntry.unitType === "liter"
            }
            label={t("unitPerPackage")}
            name="unitPerPackage"
            type="number"
            value={journalEntry.unitPerPackage}
            onChange={inputHandler}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label={t("unitPrice")}
            name="unitPrice"
            type="number"
            value={journalEntry.unitPrice}
            onChange={inputHandler}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label={t("totalPrice")}
            name="totalPrice"
            type="number"
            value={journalEntry.totalPrice}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="paymentMethod"
            label={t("paymentMethod")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.paymentMethod}
            onChange={inputHandler}
          >
            {paymentMethods.map((item, index) => (
              <MenuItem key={index} value={item}>
                {t(`${item}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            required
            disabled={
              journalEntry.paymentMethod === "cash" ||
              journalEntry.paymentMethod === "credit"
            }
            label={t("givingCash")}
            name="givingCash"
            type="number"
            value={journalEntry.givingCash}
            onChange={inputHandler}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label={t("remainingCash")}
            name="remainingCash"
            type="number"
            value={journalEntry.remainingCash}
            onChange={inputHandler}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("discount")}
            name="discount"
            type="number"
            value={journalEntry.discount}
            onChange={inputHandler}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("invoiceNo")}
            name="invoiceNo"
            type="number"
            value={nextInvoiceNo}
            disabled
          />
        </Grid>

        <Grid size={3} xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="stockName"
            label={t("stockName")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.stockName}
            onChange={inputHandler}
          >
            {stocks.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {t(`${item.engName}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={12} xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            name="supplierId"
            label={t("supplier")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.supplierId}
            onChange={inputHandler}
          >
            {suppliers.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {t(`${item.name}`)}-#{t(`${item.address}`)}-#
                {t(`${item.phone}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        color="inherit"
        style={{ marginTop: 20 }}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
          color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
        })}
        onClick={journalEntryHandler}
      >
        {t("Add")}
      </Button>
    </>
  );
};

export default PurchaseOfGoods;
