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

// unit types for purchase component
const unitTypes = ["kg", "piece", "carton", "liter", "dozen"];
const paymentMethods = ["cash", "bankTransfer", "credit", "cashAndCredit"];

const PurchaseOfGoods = ({ statusId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const journals = useSelector(selectJournals);
  const stocks = useSelector(selectStocks).stocks;
  const products = useSelector(selectProducts).products;
  const selectedDirection = useSelector(selectDirection);

  const [journalEntry, setJournalEntry] = useState({
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
    purchaseDate: "",
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
      purchaseDate: "",
    });
  };

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);

    try {
      await axios.post(
        `http://localhost:5000/api/journalEntries/purchase?statusId=${statusId}`,
        journalEntry,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
      clearState();
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
        <Grid xs={12} sm={12}>
          <Autocomplete
            disablePortal
            disableClearable
            options={products}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label={t("Products")} variant="outlined" />
            )}
            onChange={(event, value) => {
              if (value) {
                setJournalEntry({ ...journalEntry, productId: value.id });
              }
            }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("expiryDate")}
            name="expiryDate"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={journalEntry.expiryDate}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                expiryDate: event.target.value,
              })
            }
            sx={{ height: "100%", width: "100%" }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("purchaseDate")}
            name="purchaseDate"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={journalEntry.purchaseDate}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                purchaseDate: event.target.value,
              })
            }
            sx={{ height: "100%", width: "100%" }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("Quantity")}
            name="quantity"
            type="number"
            value={journalEntry.quantity}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                quantity: event.target.value,
                totalPrice:
                  journalEntry.unitPerPackage *
                  event.target.value *
                  journalEntry.quantity,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t("unitType")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.unitType}
            onChange={(event) => {
              setJournalEntry({
                ...journalEntry,
                unitType: event.target.value,
              });
            }}
          >
            {unitTypes.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("unitPerPackage")}
            name="unitPerPackage"
            type="number"
            value={journalEntry.unitPerPackage}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                unitPerPackage: event.target.value,
                totalPrice:
                  journalEntry.unitPerPackage *
                  event.target.value *
                  journalEntry.quantity,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("unitPrice")}
            name="unitPrice"
            type="number"
            value={journalEntry.unitPrice}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                unitPrice: event.target.value,
                totalPrice:
                  journalEntry.unitPerPackage *
                  event.target.value *
                  journalEntry.quantity,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            disabled
            label={t("totalPrice")}
            name="totalPrice"
            type="number"
            value={journalEntry.totalPrice}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t("paymentMethod")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.paymentMethod}
            onChange={(event) => {
              setJournalEntry({
                ...journalEntry,
                paymentMethod: event.target.value,
              });
            }}
          >
            {paymentMethods.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("invoiceNo")}
            name="invoiceNo"
            type="number"
            value={journalEntry.invoiceNo}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                invoiceNo: event.target.value,
              })
            }
          />
        </Grid>

        <Grid xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t("stockName")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.stockId} // بدل شو
            onChange={(event) => {
              const selectedId = event.target.value;
              const selectedType = stocks.find(
                (item) => item.id === selectedId
              );

              setJournalEntry({
                ...journalEntry,
                stockName: selectedType?.name || "",
                stockId: selectedId,
              });
            }}
          >
            {stocks.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
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
