import React, { useState } from "react";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import axios from "axios";

const LedgerForm = () => {
  const [ledger, setLedger] = useState({
    note: "",
    price: 0,
    totalPrice: 0,
    salePrice: 0,
    status: "paid",
    companyName: "",
    category: "",
    quantity: 0,
  });

  // ledger handler
  const createLedgerHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ledgers",
        ledger,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLedger({
        note: "",
        price: 0,
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
            fullWidth
            label="Name | Note | Description"
            name="note"
            value={ledger.note}
            onChange={(event) =>
              setLedger({ ...ledger, note: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ledger Price"
            name="price"
            type="number"
            value={ledger.price}
            onChange={(event) =>
              setLedger({
                ...ledger,
                price: event.target.value,
                totalPrice: ledger.quantity * event.target.value,
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
            value={ledger.quantity}
            onChange={(event) =>
              setLedger({
                ...ledger,
                quantity: event.target.value,
                totalPrice: ledger.price * event.target.value,
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
            value={ledger.quantity * ledger.price}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sale Price"
            name="salePrice"
            type="number"
            value={ledger.salePrice}
            onChange={(event) =>
              setLedger({ ...ledger, salePrice: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={ledger.status}
            onChange={(event) =>
              setLedger({ ...ledger, status: event.target.value })
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
            value={ledger.companyName}
            onChange={(event) =>
              setLedger({ ...ledger, companyName: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category "
            name="category"
            value={ledger.category}
            onChange={(event) =>
              setLedger({ ...ledger, category: event.target.value })
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
        onClick={createLedgerHandler}
      >
        Create Ledger
      </Button>
    </form>
  );
};

export default LedgerForm;
