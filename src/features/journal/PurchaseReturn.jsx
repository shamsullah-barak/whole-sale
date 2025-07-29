import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";

const dummyPurchases = [
  {
    id: "purchase1",
    supplier: "Ahmad Ltd.",
    items: [
      { id: "item1", name: "Sugar", quantity: 10 },
      { id: "item2", name: "Oil", quantity: 5 },
    ],
  },
  {
    id: "purchase2",
    supplier: "Karimi Store",
    items: [{ id: "item3", name: "Flour", quantity: 8 }],
  },
];

const PurchaseReturnForm = () => {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");
  const [returnQuantities, setReturnQuantities] = useState({});

  const handleSelectChange = (e) => {
    setSelectedPurchaseId(e.target.value);
    setReturnQuantities({});
  };

  const handleReturnQtyChange = (itemId, value) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [itemId]: Number(value),
    }));
  };

  const handleSubmit = () => {
    const selectedPurchase = dummyPurchases.find(
      (p) => p.id === selectedPurchaseId
    );
    const returnedItems = selectedPurchase.items.map((item) => ({
      ...item,
      returnQty: returnQuantities[item.id] || 0,
    }));
    console.log("Returned Items:", returnedItems);
    alert("Purchase return submitted!");
  };

  const selectedPurchase = dummyPurchases.find(
    (p) => p.id === selectedPurchaseId
  );

  return (
    <Box
      sx={{
        mx: "auto",
        mt: 3,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Purchase</InputLabel>
        <Select
          value={selectedPurchaseId}
          onChange={handleSelectChange}
          label="Select Purchase"
        >
          {dummyPurchases.map((purchase) => (
            <MenuItem key={purchase.id} value={purchase.id}>
              {purchase.supplier} - #{purchase.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedPurchase && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Purchased Qty</TableCell>
                <TableCell>Return Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedPurchase.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{ min: 0, max: item.quantity }}
                      value={returnQuantities[item.id] || ""}
                      onChange={(e) =>
                        handleReturnQtyChange(item.id, e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedPurchase && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Submit Return
        </Button>
      )}
    </Box>
  );
};

export default PurchaseReturnForm;
