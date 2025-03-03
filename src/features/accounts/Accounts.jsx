import React from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import CustomizedDataGrid from "./components/CustomizedDataGrid";

const Accounts = () => {
  return (
    <MainDashboard title="Accounts">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%", textAlign: "right" }}>
          <NavLink to="/accounts/add">
            <Button variant="outlined">New Account</Button>
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

export default Accounts;
