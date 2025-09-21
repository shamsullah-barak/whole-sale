import React, { useState } from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { NavLink } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import { fetchStocksAsync } from "../../store/slices/stock.slice";

const CreateStockForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [stock, setStock] = useState({ name: "", location: "" });

  const stockHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/stocks",
        stock,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchStocksAsync());
      toast.success("stock create");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid xs={12} sm={6} sx={{ width: "49%" }}>
          <TextField
            fullWidth
            label={t("name")}
            name="name"
            type="text"
            value={stock.name}
            onChange={(event) =>
              setStock({
                ...stock,
                name: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6} sx={{ width: "49%" }}>
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
        </Grid>

        <Grid xs={12} sm={6} sx={{ width: "100%" }}>
          <Button
            type="submit"
            variant="contained"
            color="inherit"
            fullWidth
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
              color:
                theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
            })}
            style={{ marginTop: 20 }}
            onClick={stockHandler}
          >
            {t("createStock")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const CreateStock = () => {
  const { t } = useTranslation();
  const selectedDirection = useSelector(selectDirection);
  return (
    <MainDashboard title="Stock > Create">
      {/* <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", textAlign: "left" }}>
          <NavLink to="/stocks">
            <Button
              variant="contained"
              color="inherit"
              sx={(theme) => ({
                backgroundColor:
                  theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
                color:
                  theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
              })}
            >
              {t("Back")}
            </Button>
          </NavLink>
        </Grid>
      </Grid>
      <CreateStockForm /> */}

      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{
            width: "100%",
            textAlign: selectedDirection === "rtl" ? "left" : "right",
          }}
        >
          <NavLink to="/stocks">
            <Button
              variant="contained"
              color="inherit"
              sx={(theme) => ({
                backgroundColor:
                  theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
                color:
                  theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
              })}
            >
              {t("Back")}
            </Button>
          </NavLink>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <CreateStockForm />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default CreateStock;
