import React from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { NavLink } from "react-router-dom";
import { Button, Typography, Grid, Paper } from "@mui/material";
import LedgerForm from "./LedgerForm";
import { useTranslation } from "react-i18next";

const CreateLedger = () => {
  const { t } = useTranslation();
  return (
    <MainDashboard title="Ledgers > Create">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", textAlign: "left" }}>
          <NavLink to="/ledgers">
            <Button variant="outlined" sx={{ width: "100px" }}>
              {t("Back")}
            </Button>
          </NavLink>
        </Grid>
      </Grid>

      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          {t("Create Ledger")}
        </Typography>
        <LedgerForm />
      </Paper>
    </MainDashboard>
  );
};

export default CreateLedger;
