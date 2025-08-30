import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { InputAdornment, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";

const PurchaseReturnForm = () => {
  const { t } = useTranslation();
  const [unitTypes, setUnitTypes] = useState([]);
  const [purchase, setPurchase] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [purchaseReturn, setPurchaseReturn] = useState({
    quantity: "",
    unitType: "",
    returnReason: "",
    totalReturn: true,
  });

  const selectedDirection = useSelector(selectDirection);

  const clearState = () => {
    setUnitTypes([]);
    setPurchase(null);
    setDebouncedQuery("");
    setQuery("");
    setPurchaseReturn({
      quantity: "",
      unitType: "",
      returnReason: "",
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
          if (
            res?.data?.results[0]?.unitType === "carton" ||
            res?.data?.results[0]?.unitType === "dozen"
          ) {
            setUnitTypes(["piece", res?.data?.results[0]?.unitType]);
          }
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

  const handleSubmit = async () => {
    const data = {
      returnReason: purchaseReturn.returnReason,
      purchaseId: purchase._id,
      returnQuantity: purchaseReturn.quantity,
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
          border: "1px solid #ccc",
          borderRadius: 2,
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

        {/* {purchase && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t(`productName`)}</TableCell>
                  <TableCell>{t(`quantity`)}</TableCell>
                  {purchase.unitType !== "kg" &&
                    purchase.unitType !== "piece" &&
                    purchase.unitType !== "liter" && (
                      <>
                        <TableCell>{t(`unitPerPackage`)}</TableCell>
                        <TableCell>{t(`totalQuantity`)}</TableCell>
                      </>
                    )}
                  <TableCell>{t(`returnQty`)}</TableCell>
                  {purchase.unitType !== "kg" &&
                    purchase.unitType !== "piece" &&
                    purchase.unitType !== "liter" && (
                      <>
                        <TableCell>{t(`unitType`)}</TableCell>
                      </>
                    )}
                </TableRow>
              </TableHead>
              <TableBody>
                {purchase && (
                  <>
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.productName}</TableCell>
                      <TableCell>
                        {purchase.quantity} {purchase.unitType}
                      </TableCell>

                      {purchase.unitType !== "kg" &&
                        purchase.unitType !== "piece" &&
                        purchase.unitType !== "liter" && (
                          <>
                            <TableCell>{purchase.unitPerPackage}</TableCell>
                            <TableCell>
                              {purchase.quantity * purchase.unitPerPackage}
                            </TableCell>
                          </>
                        )}

                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          style={{ minWidth: "100px" }}
                          value={purchaseReturn.quantity}
                          onChange={(event) =>
                            setPurchaseReturn({
                              ...purchaseReturn,
                              quantity: event.target.value,
                            })
                          }
                          inputProps={{ min: 0, max: purchase.quantity }}
                        />
                      </TableCell>

                      {purchase.unitType !== "kg" &&
                        purchase.unitType !== "piece" &&
                        purchase.unitType !== "liter" && (
                          <TableCell>
                            <TextField
                              select
                              size="small"
                              name="unitType"
                              style={{ minWidth: "100px" }}
                              dir={
                                selectedDirection === "rtl" ? "right" : "left"
                              }
                              value={purchaseReturn.unitType}
                              onChange={(event) =>
                                setPurchaseReturn({
                                  ...purchaseReturn,
                                  unitType: event.target.value,
                                })
                              }
                            >
                              {unitTypes.map((item, index) => (
                                <MenuItem key={index} value={item}>
                                  {t(`${item}`)}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                        )}
                    </TableRow>
                  </>
                )}
                <TableRow>
                  {purchase && (
                    <TableCell colSpan={100}>
                      <TextField
                        fullWidth
                        label={t("returnReason")}
                        name="returnReason"
                        type="text"
                        value={purchaseReturn.returnReason}
                        onChange={(event) =>
                          setPurchaseReturn({
                            ...purchaseReturn,
                            returnReason: event.target.value,
                          })
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )} */}
        {purchase && (
          <>
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
              <Grid size={3} xs={12} sm={12}>
                <Typography>product name</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>purchase quantity</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>total return</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>select return quantity</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
              <Grid size={3} xs={12} sm={12}>
                <Typography>{purchase.productName}</Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <Typography>
                  {purchase.quantity} {purchase.unitType}
                </Typography>
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="checkbox"
                  value={purchaseReturn.totalReturn}
                  onChange={(event) => console.log(event.isTrusted)}
                />
              </Grid>
              <Grid size={3} xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={purchaseReturn.quantity}
                  onChange={(event) =>
                    setPurchaseReturn({
                      ...purchaseReturn,
                      quantity: event.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: "15px" }}>
              <Grid size={12} xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="returnReason"
                  type="text"
                  value={purchaseReturn.returnReason}
                  onChange={(event) =>
                    setPurchaseReturn({
                      ...purchaseReturn,
                      returnReason: event.target.value,
                    })
                  }
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
