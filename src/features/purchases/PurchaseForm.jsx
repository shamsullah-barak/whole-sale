import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  TextField,
  MenuItem,
  Button,
  Grid2 as Grid,
  Autocomplete,
  Divider,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import { selectJournals } from "../../store/selectors/journal.selector";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { selectProducts } from "../../store/selectors/product.selector";
import { ToastContainer, toast } from "react-toastify";
import { selectStocks } from "../../store/selectors/stock.selector";
import { selectSuppliers } from "../../store/selectors/businessEntity.selector";
import { fetchPurchasesAsync } from "../../store/slices/purchase.slice";
import { selectNextInvoiceNo } from "../../store/selectors/purchase.selector";
import { useParams } from "react-router-dom";
import { fetchCashboxBalancesAsync } from "../../store/slices/cashbox.slice";
import { CURRENCY_TYPES } from "../../constant/variables";

// unit types for purchase component
const unitTypes = ["kg", "piece", "carton", "liter", "dozen"];
const paymentMethods = ["cash", "credit", "cashAndCredit"];

const PurchaseOfGoods = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const journals = useSelector(selectJournals);
  const nextInvoiceNo = useSelector(selectNextInvoiceNo);
  const stocks = useSelector(selectStocks).stocks;
  const { products } = useSelector(selectProducts);
  const suppliers = useSelector(selectSuppliers).suppliers;
  const selectedDirection = useSelector(selectDirection);
  const [journalEntry, setJournalEntry] = useState({
    items: [
      {
        productId: "",
        quantity: 20,
        unitType: "kg",
        unitPerPackage: 1,
        unitPrice: 120,
        stockId: "",
        expiryDate: "2025-12-31",
      },
    ],
    paymentMethod: "cash",
    givingCash: 3000,
    remainingCash: 0,
    supplierId: "",
    discount: 0,
    currencyType: "afn",
  });

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setJournalEntry((prevState) => {
      const updatedEntry = { ...prevState, [name]: value };
      const { paymentMethod, givingCash } = updatedEntry;
      const total = calculateGrandTotal(
        updatedEntry.items,
        updatedEntry.discount
      );

      if (paymentMethod === "credit") {
        updatedEntry.remainingCash = total;
        updatedEntry.givingCash = 0;
      } else if (paymentMethod === "cash") {
        updatedEntry.remainingCash = 0;
        updatedEntry.givingCash = total;
      } else if (paymentMethod === "cashAndCredit") {
        updatedEntry.remainingCash = total - (Number(givingCash) || 0);
      }
      return updatedEntry;
    });
  };

  const handleItemChange = (index, field, value) => {
    setJournalEntry((prev) => {
      const items = [...prev.items];
      const updatedItem = { ...items[index], [field]: value };
      if (field === "unitType" && ["kg", "piece", "liter"].includes(value)) {
        updatedItem.unitPerPackage = 1;
      }
      items[index] = updatedItem;
      const updated = { ...prev, items };
      const total = calculateGrandTotal(items, updated.discount);
      if (updated.paymentMethod === "credit") {
        updated.remainingCash = total;
        updated.givingCash = 0;
      } else if (updated.paymentMethod === "cash") {
        updated.remainingCash = 0;
        updated.givingCash = total;
      } else if (updated.paymentMethod === "cashAndCredit") {
        updated.remainingCash = total - (Number(updated.givingCash) || 0);
      }
      return updated;
    });
  };

  const addItem = () => {
    setJournalEntry((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: "",
          quantity: "",
          unitType: "kg",
          unitPerPackage: "",
          unitPrice: "",
          stockId: "",
          expiryDate: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setJournalEntry((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      const updated = { ...prev, items };
      const total = calculateGrandTotal(items, updated.discount);
      if (updated.paymentMethod === "credit") {
        updated.remainingCash = total;
        updated.givingCash = 0;
      } else if (updated.paymentMethod === "cash") {
        updated.remainingCash = 0;
        updated.givingCash = total;
      } else if (updated.paymentMethod === "cashAndCredit") {
        updated.remainingCash = total - (Number(updated.givingCash) || 0);
      }
      return updated;
    });
  };

  const calculateLineTotal = (item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPerPackage = Number(item.unitPerPackage) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return quantity * unitPerPackage * unitPrice;
  };

  const calculateGrandTotal = (items, discount = 0) => {
    const subtotal = items.reduce((sum, it) => sum + calculateLineTotal(it), 0);
    return subtotal - (Number(discount) || 0);
  };

  const grandTotal = useMemo(
    () => calculateGrandTotal(journalEntry.items, journalEntry.discount),
    [journalEntry.items, journalEntry.discount]
  );

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);

    setLoading(true);

    const cleanedEntry = { ...journalEntry };
    if (!cleanedEntry.invoiceNo) delete cleanedEntry.invoiceNo;
    cleanedEntry.totalPrice = grandTotal;

    if (cleanedEntry.supplierId === "") cleanedEntry.supplierId = null;

    if (id) {
      delete cleanedEntry.__v;
      delete cleanedEntry.createdAt;
      delete cleanedEntry.updatedAt;
      delete cleanedEntry._id;

      try {
        await axios.patch(
          `http://localhost:5000/api/purchases/${id}`,
          cleanedEntry,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        dispatch(
          fetchPurchasesAsync({ page: 1, limit: journals?.limitPerPage })
        );
        dispatch(fetchCashboxBalancesAsync());
        toast.success("data updated");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(
          error?.response?.data?.message ??
            "something went wrong! please try again"
        );
      }
    } else {
      try {
        await axios.post(`http://localhost:5000/api/purchases`, cleanedEntry, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        dispatch(
          fetchPurchasesAsync({ page: 1, limit: journals?.limitPerPage })
        );
        toast.success("data added");
        // clearState();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(
          error?.response?.data?.message ??
            "something went wrong! please try again"
        );
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} sx={{ marginTop: "15px" }}>
        <Grid size={12} xs={12} sx={{ textAlign: "right" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("invoiceNo")} #{nextInvoiceNo}
          </Typography>
        </Grid>

        <Grid size={12} xs={12}>
          <Divider>
            <Typography variant="subtitle1">{t("Products")}</Typography>
          </Divider>
        </Grid>

        {journalEntry.items.map((item, index) => (
          <Box
            key={index}
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
              onClick={() => removeItem(index)}
              disabled={journalEntry.items.length === 1}
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
                <Autocomplete
                  disablePortal
                  disableClearable
                  options={products}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("Products")}
                      required
                      size="small"
                    />
                  )}
                  value={products.find((p) => p._id === item.productId) || null}
                  onChange={(event, value) =>
                    value && handleItemChange(index, "productId", value._id)
                  }
                />
              </Grid>

              <Grid size={3} xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label={t("Quantity")}
                  required
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
              </Grid>

              <Grid size={3} xs={12} sm={6}>
                <TextField
                  size="small"
                  select
                  fullWidth
                  label={t("Unit Type")}
                  required
                  value={item.unitType}
                  onChange={(e) =>
                    handleItemChange(index, "unitType", e.target.value)
                  }
                >
                  {unitTypes.map((ut, i) => (
                    <MenuItem key={i} value={ut}>
                      {t(`${ut}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={3} xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  disabled={["kg", "piece", "liter"].includes(item.unitType)}
                  label={t("Unit Per Package")}
                  type="number"
                  value={item.unitPerPackage}
                  onChange={(e) =>
                    handleItemChange(index, "unitPerPackage", e.target.value)
                  }
                />
              </Grid>

              {/* Row 2 */}
              <Grid size={3} xs={12} sm={6}>
                <TextField
                  size="small"
                  select
                  fullWidth
                  label={t("Stock Name")}
                  required
                  value={item.stockId}
                  onChange={(e) =>
                    handleItemChange(index, "stockId", e.target.value)
                  }
                >
                  {stocks.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {t(s.engName)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={3} xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label={t("Unit Price")}
                  type="number"
                  required
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(index, "unitPrice", e.target.value)
                  }
                />
              </Grid>

              <Grid size={3} xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  label={t("Expiry Date")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={item.expiryDate}
                  onChange={(e) =>
                    handleItemChange(index, "expiryDate", e.target.value)
                  }
                />
              </Grid>

              <Grid size={3} xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  disabled
                  label={t("Total Price")}
                  type="number"
                  value={calculateLineTotal(item)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Grid size={12} xs={12} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addItem}
            style={{ width: "100%" }}
          >
            {t("Add Product")}
          </Button>
        </Grid>

        <Grid size={12} xs={12}>
          <Divider sx={{ mt: 2 }}>
            <Typography variant="subtitle1">{t("Payment & Party")}</Typography>
          </Divider>
        </Grid>
        <Grid size={12} xs={12} sm={6}>
          <TextField
            size="small"
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
              <MenuItem key={index} value={item._id}>
                {t(`${item.name}`)}-#{t(`${item.address}`)}-#
                {t(`${item.phone}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            size="small"
            select
            fullWidth
            required
            name="currencyType"
            label={t("currencyType")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.currencyType}
            onChange={inputHandler}
          >
            {CURRENCY_TYPES.map((item, index) => (
              <MenuItem key={index} value={item}>
                {t(`${item}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            size="small"
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
            size="small"
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
            size="small"
            fullWidth
            disabled
            label={t("remainingCash")}
            name="remainingCash"
            type="number"
            value={journalEntry.remainingCash}
            onChange={inputHandler}
          />
        </Grid>

        <Grid size={12} xs={12}>
          <Divider sx={{ mt: 2 }}>
            <Typography variant="subtitle1">{t("Summary & Date")}</Typography>
          </Divider>
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            disabled
            label={t("totalPrice")}
            name="grandTotal"
            type="number"
            value={grandTotal}
          />
        </Grid>
        <Grid size={3} xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label={t("discount")}
            name="discount"
            type="number"
            value={journalEntry.discount}
            onChange={inputHandler}
          />
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
        loading={loading}
        disabled={loading}
        onClick={journalEntryHandler}
      >
        {id ? <>{t("update")}</> : <>{t("Add")}</>}
      </Button>
    </>
  );
};

export default PurchaseOfGoods;
