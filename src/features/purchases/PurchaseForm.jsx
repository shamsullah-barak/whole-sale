import React, { useState } from "react";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const PurchaseForm = () => {
  const [purchase, setPurchase] = useState({
    note: "",
    purchasedPrice: 0,
    totalPrice: 0,
    salePrice: 0,
    status: "paid",
    companyName: "",
    category: "",
    quantity: 0,
  });

  // purchase handler
  const createPurchaseHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/purchases",
        purchase,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPurchase({
        note: "",
        purchasedPrice: 0,
        totalPrice: 0,
        salePrice: 0,
        status: "paid",
        companyName: "",
        category: "",
        quantity: 0,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  return (
    <form>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name | Note | Description"
            name="note"
            value={purchase.note}
            onChange={(event) =>
              setPurchase({ ...purchase, note: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Purchase Price"
            name="purchasedPrice"
            type="number"
            value={purchase.purchasedPrice}
            onChange={(event) =>
              setPurchase({
                ...purchase,
                purchasedPrice: event.target.value,
                totalPrice: purchase.quantity * event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={purchase.quantity}
            onChange={(event) =>
              setPurchase({
                ...purchase,
                quantity: event.target.value,
                totalPrice: purchase.purchasedPrice * event.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Price"
            name="totalPrice"
            type="number"
            value={purchase.quantity * purchase.purchasedPrice}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sale Price"
            name="salePrice"
            type="number"
            value={purchase.salePrice}
            onChange={(event) =>
              setPurchase({ ...purchase, salePrice: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={purchase.status}
            onChange={(event) =>
              setPurchase({ ...purchase, status: event.target.value })
            }
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={purchase.companyName}
            onChange={(event) =>
              setPurchase({ ...purchase, companyName: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category "
            name="category"
            value={purchase.category}
            onChange={(event) =>
              setPurchase({ ...purchase, category: event.target.value })
            }
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 20 }}
        onClick={createPurchaseHandler}
      >
        Create Purchase
      </Button>
    </form>
  );
};

export default PurchaseForm;
