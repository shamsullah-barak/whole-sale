import React from "react";
import { NavLink } from "react-router-dom";

import { Button, Typography, Grid, Paper } from "@mui/material";
import PurchaseForm from "./PurchaseForm";

const CreatePurchases = () => {
  return (
    <>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", textAlign: "left" }}>
          <NavLink to="/purchases">
            <Button variant="outlined" sx={{ width: "100px" }}>
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          mt: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Create Purchase
        </Typography>
        <PurchaseForm />
      </Paper>
    </>
  );
};

export default CreatePurchases;
