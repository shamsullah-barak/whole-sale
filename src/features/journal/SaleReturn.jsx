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

const SaleReturn = () => {
  const { t } = useTranslation();
  const [unitTypes, setUnitTypes] = useState([]);
  const [sale, setSale] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [saleReturn, setSaleReturn] = useState({
    quantity: "",
    unitType: "",
    returnReason: "",
  });

  const selectedDirection = useSelector(selectDirection);

  const clearState = () => {
    setUnitTypes([]);
    setSale(null);
    setDebouncedQuery("");
    setQuery("");
    setSaleReturn({
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
          `http://localhost:5000/api/sales?saleCounter=${debouncedQuery}`
        );
        console.log({ res });
        if (res.data.results[0]) {
          setSale({ ...res.data.results[0] });
          if (
            res?.data?.results[0]?.unitType === "carton" ||
            res?.data?.results[0]?.unitType === "dozen"
          ) {
            setUnitTypes(["piece", res?.data?.results[0]?.unitType]);
          }
        } else {
          toast.info("sale not found");
          setSale(null);
          setUnitTypes([]);
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
      returnReason: saleReturn.returnReason,
      saleId: sale._id,
      returnQuantity: saleReturn.quantity,
      returnQuantityType: saleReturn.unitType
        ? saleReturn.unitType
        : sale.unitType,
    };

    try {
      await axios.post("http://localhost:5000/api/sale-return", data, {
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

  console.log({ sale });

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

        {sale && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t(`productName`)}</TableCell>
                  <TableCell>{t(`quantity`)}</TableCell>
                  {sale.unitType !== "kg" &&
                    sale.unitType !== "piece" &&
                    sale.unitType !== "liter" && (
                      <>
                        <TableCell>{t(`unitPerPackage`)}</TableCell>
                        <TableCell>{t(`totalQuantity`)}</TableCell>
                      </>
                    )}
                  <TableCell>{t(`returnQty`)}</TableCell>
                  {sale.unitType !== "kg" &&
                    sale.unitType !== "piece" &&
                    sale.unitType !== "liter" && (
                      <>
                        <TableCell>{t(`unitType`)}</TableCell>
                      </>
                    )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sale && (
                  <>
                    <TableRow key={sale.id}>
                      <TableCell>{sale.productName}</TableCell>
                      <TableCell>
                        {sale.quantity} {sale.unitType}
                      </TableCell>

                      {sale.unitType !== "kg" &&
                        sale.unitType !== "piece" &&
                        sale.unitType !== "liter" && (
                          <>
                            <TableCell>{sale.unitPerPackage}</TableCell>
                            <TableCell>
                              {sale.quantity * sale.unitPerPackage}
                            </TableCell>
                          </>
                        )}

                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          style={{ minWidth: "100px" }}
                          value={saleReturn.quantity}
                          onChange={(event) =>
                            setSaleReturn({
                              ...saleReturn,
                              quantity: event.target.value,
                            })
                          }
                          inputProps={{ min: 0, max: sale.quantity }}
                        />
                      </TableCell>

                      {sale.unitType !== "kg" &&
                        sale.unitType !== "piece" &&
                        sale.unitType !== "liter" && (
                          <TableCell>
                            <TextField
                              select
                              size="small"
                              name="unitType"
                              style={{ minWidth: "100px" }}
                              dir={
                                selectedDirection === "rtl" ? "right" : "left"
                              }
                              value={saleReturn.unitType}
                              onChange={(event) =>
                                setSaleReturn({
                                  ...saleReturn,
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
                  {sale && (
                    <TableCell colSpan={100}>
                      <TextField
                        fullWidth
                        label={t("returnReason")}
                        name="returnReason"
                        type="text"
                        value={saleReturn.returnReason}
                        onChange={(event) =>
                          setSaleReturn({
                            ...saleReturn,
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
        )}

        {sale && (
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="inherit"
            style={{ marginTop: 20 }}
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
              color:
                theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
            })}
            onClick={handleSubmit}
          >
            {t("Add")}
          </Button>
        )}
      </Box>
    </>
  );
};

export default SaleReturn;
