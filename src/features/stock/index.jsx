import React from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { selectDirection } from "../../store/selectors/app.selector";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { selectStocks } from "../../store/selectors/stock.selector";

const StockList = () => {
  const stocks = useSelector(selectStocks).stocks;
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      aria-label="contacts"
    >
      {stocks.map((item) => (
        <ListItem disablePadding key={item.id} component={NavLink} to={item.id}>
          <ListItemButton>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const Stock = () => {
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();
  return (
    <>
      <MainDashboard title="Stock">
        <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
          <Grid
            xs={12}
            lg={9}
            sx={{
              width: "100%",
              textAlign: selectedDirection === "rtl" ? "left" : "right",
            }}
          >
            <NavLink to="/stocks/create">
              <Button
                variant="contained"
                color="inherit"
                sx={(theme) => ({
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? COLORS.WHITE
                      : COLORS.PURPLE,
                  color:
                    theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
                })}
              >
                {t("New Stock")}
              </Button>
            </NavLink>
          </Grid>
        </Grid>
        <StockList />
      </MainDashboard>
    </>
  );
};

export default Stock;
