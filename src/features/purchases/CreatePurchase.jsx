import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Button, Typography, Grid, Paper, Stack, Box } from "@mui/material";
import PurchaseForm from "./PurchaseForm";
import { ToastContainer } from "react-toastify";
import { ArrowBack } from "@mui/icons-material";

const CreatePurchases = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/purchases");
  };
  return (
    <>
      {/* <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", textAlign: "left" }}>
          <NavLink to="/purchases">
            <Button variant="outlined" sx={{ width: "100px" }}>
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid> */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <ToastContainer />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {/* {isEdit ? "Edit Sale" : "Create New Sale"} */}
              Create New Purchase
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {/* {isEdit
                ? "Update sale information"
                : "Add a new sale transaction"} */}
              Add a new sale transaction
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleCancel}
          >
            Back to Purchases
          </Button>
        </Stack>
      </Paper>

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
