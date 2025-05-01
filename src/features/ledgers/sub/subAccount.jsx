import React, { useState } from "react";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import axios from "axios";

const financialTerms = [
  "Money deposit",
  "Money withdrawal",
  "Issuing a remittance",
  "Receiving a remittance",
  "Purchase of goods",
  "Purchase return",
  "Sale of goods",
  "Sales return",
  "Settlement of balance",
  "Settlement of receivables",
];

const SubAccountForm = () => {
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
      console.log(error);
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
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
            {financialTerms.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
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

export default SubAccountForm;
