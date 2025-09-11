import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { InputAdornment, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";

const TOTAL_RETURN = "TOTAL_RETURN";

const PurchaseReturnForm = () => {
  const { t } = useTranslation();
  const [unitTypes, setUnitTypes] = useState([]);
  const [purchase, setPurchase] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedDirection = useSelector(selectDirection);

  const [purchaseReturn, setPurchaseReturn] = useState({
    quantity: "",
    unitType: "",
    returnReason: "",
    totalReturn: false,
  });

  const clearState = () => {
    setUnitTypes([]);
    setPurchase(null);
    setDebouncedQuery("");
    setQuery("");
    setPurchaseReturn({
      quantity: "",
      unitType: "",
      returnReason: "",
      totalReturn: false,
    });
  };
  // Debounce input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // API call
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/purchases?invoiceNo=${debouncedQuery}`
        );
        if (res.data.results[0]) {
          setPurchase({ ...res.data.results[0] });
          setUnitTypes(["piece", res?.data?.results[0]?.unitType]);
        } else {
          setPurchase(null);
          setUnitTypes([]);
          toast.info("No Purchase was found with this number");
        }
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
  }, [debouncedQuery]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === TOTAL_RETURN) {
      setPurchaseReturn({
        ...purchaseReturn,
        totalReturn: checked,
        unitType: purchase.unitType,
        quantity: purchase.quantity,
      });
    } else {
      setPurchaseReturn({
        ...purchaseReturn,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    const data = {
      returnReason: purchaseReturn.returnReason,
      purchaseId: purchase._id,
      returnQuantity: purchaseReturn.totalReturn
        ? purchase.quantity
        : purchaseReturn.quantity,
      returnQuantityType: purchaseReturn.unitType
        ? purchaseReturn.unitType
        : purchase.unitType,
    };

    try {
      await axios.post("http://localhost:5000/api/purchase-return", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      clearState();

      toast.success("data added");
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
      <Box
        sx={{
          mx: "auto",
          mt: 3,
          p: 3,
        }}
      >
        <FormControl fullWidth margin="normal">
          <Grid xs={12} sm={6}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              type="number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading && <CircularProgress size={20} />}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </FormControl>

        {purchase && (
          <>
            <Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
              <Grid size={3} xs={12} sm={12}>
                <Typography>product name</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>purchase quantity</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>sold quantity</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>available quantity</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
              <Grid size={3} xs={12} sm={12}>
                <Typography>{purchase.quantity}</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>
                  {purchase.quantity} {purchase.unitType}
                </Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>
                  {purchase.quantity} {purchase.unitType}
                </Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>
                  {purchase.quantity} {purchase.unitType}
                </Typography>
              </Grid>
            </Grid>

            <Divider style={{ marginTop: "20px", marginBottom: "30px" }} />
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
              <Grid size={4} xs={12} sm={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={TOTAL_RETURN}
                      checked={purchaseReturn.totalReturn}
                      onChange={handleChange}
                    />
                  }
                  label="Total Return"
                />
              </Grid>
              <Grid size={4} xs={12} sm={12}>
                <TextField
                  select
                  fullWidth
                  required
                  name="unitType"
                  label={t("unitType")}
                  style={{ minWidth: "200px" }}
                  type="text"
                  disabled={purchaseReturn.totalReturn}
                  dir={selectedDirection === "rtl" ? "right" : "left"}
                  value={purchaseReturn.unitType}
                  onChange={handleChange}
                >
                  {unitTypes.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {t(`${item}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={4} xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Select Return Quantity"
                  type="number"
                  name="quantity"
                  disabled={purchaseReturn.totalReturn}
                  value={purchaseReturn.quantity}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
              <Grid size={12} xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="returnReason"
                  name="returnReason"
                  type="text"
                  value={purchaseReturn.returnReason}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
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
                    theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
                })}
                onClick={handleSubmit}
              >
                {t("Add")}
              </Button>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
};

export default PurchaseReturnForm;
