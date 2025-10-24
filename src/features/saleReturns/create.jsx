import React, { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SaleReturnCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ saleId: "", returnQuantity: 1, returnQuantityType: "piece", returnReason: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/sale-returns`, form);
      navigate(`/sales/returns`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Create Sale Return</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} direction="column">
          <TextField label="Sale ID" name="saleId" value={form.saleId} onChange={handleChange} required />
          <TextField label="Return Quantity" type="number" name="returnQuantity" value={form.returnQuantity} onChange={handleChange} required />
          <TextField label="Quantity Type" name="returnQuantityType" value={form.returnQuantityType} onChange={handleChange} required />
          <TextField label="Reason" name="returnReason" value={form.returnReason} onChange={handleChange} />
          <Box>
            <Button type="submit" variant="contained" disabled={loading}>Save</Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SaleReturnCreate;
