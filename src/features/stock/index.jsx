import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MainDashboard from "../../theme/main/MainDashboard";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { selectDirection } from "../../store/selectors/app.selector";
import { useDispatch, useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { selectStocks } from "../../store/selectors/stock.selector";
import Model from "../../components/Model";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { fetchStocksAsync } from "../../store/slices/stock.slice";

const StockList = () => {
  const stocks = useSelector(selectStocks).stocks;
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      aria-label="contacts"
    >
      {stocks.map((item) => (
        <ListItem
          disablePadding
          key={item.id}
          component={NavLink}
          to={item.engName}
        >
          <ListItemButton>
            <ListItemText primary={item.engName} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const CreateStock = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState({ stockName: "", location: "" });

  const selectedDirection = useSelector(selectDirection);
  const dispatch = useDispatch();

  // methods
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    setLoading(true);

    const data = { name: stock.stockName, location: stock.location };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/stocks",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchStocksAsync());
      toast.success("stock create");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ??
          "something went wrong please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{
            width: "100%",
            textAlign: selectedDirection === "rtl" ? "left" : "right",
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
              color:
                theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
            })}
            onClick={() => setOpen(true)}
          >
            {t("newStock")}
          </Button>
        </Grid>
      </Grid>

      <Model
        open={open}
        handleClose={handleClose}
        submit="submit"
        cancel="cancel"
        loading={loading}
        disabled={loading}
        handleSubmit={handleSubmit}
      >
        <Typography variant="h6" mb={2}>
          Add new Stock
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label={t("stockName")}
            name="stockName"
            type="text"
            value={stock.stockName}
            onChange={(event) =>
              setStock({
                ...stock,
                stockName: event.target.value,
              })
            }
          />

          <TextField
            fullWidth
            label={t("location")}
            name="location"
            type="text"
            value={stock.location}
            onChange={(event) =>
              setStock({
                ...stock,
                location: event.target.value,
              })
            }
          />
        </Stack>
      </Model>
    </>
  );
};

const Stock = () => {
  return (
    <>
      <MainDashboard title="Stock">
        <CreateStock />
        <StockList />
      </MainDashboard>
    </>
  );
};

export default Stock;
