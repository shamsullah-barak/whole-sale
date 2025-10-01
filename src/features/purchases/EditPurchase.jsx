import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button, Typography, Grid, Paper } from "@mui/material";
import PurchaseForm from "./PurchaseForm";

const EditPurchase = () => {
  const { id } = useParams();
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

      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          Edit Purchase
        </Typography>
        <PurchaseForm key={id} />
      </Paper>
    </>
  );
};

export default EditPurchase;


