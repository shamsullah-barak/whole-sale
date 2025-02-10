import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectProducts,
} from "./productSlice";

import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import { fetchProducts } from "./productAPI";

const Products = () => {
  const products = useSelector(selectProducts);
  console.log({ products });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  // const [incrementAmount, setIncrementAmount] = useState("2");

  // const incrementValue = Number(incrementAmount) || 0;

  return (
    <MainDashboard title="Products">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%" }}>
          <CustomizedDataGrid products={products} />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Products;
