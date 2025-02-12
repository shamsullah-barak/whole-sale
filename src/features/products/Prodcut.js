import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProductsAsync } from "./productSlice";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const Products = () => {
  return (
    <MainDashboard title="Products">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%", textAlign: "right" }}>
          <NavLink to="/products/add">
            <Button variant="outlined">New Product</Button>
          </NavLink>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%" }}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Products;
