import React from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { NavLink } from "react-router-dom";
import { Button, Typography, Grid, Paper } from "@mui/material";
import LedgerForm from "./LedgerForm";

const CreateLedger = () => {
  return (
    <MainDashboard title="Ledgers > Create">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", textAlign: "left" }}>
          <NavLink to="/ledgers">
            <Button variant="outlined" sx={{ width: "100px" }}>
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>

      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          Create Ledger
        </Typography>
        <LedgerForm />
      </Paper>
    </MainDashboard>
  );
};

export default CreateLedger;
