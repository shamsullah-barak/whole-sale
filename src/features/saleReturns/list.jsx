import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import Datagrid from "../../components/DataGrid";
import { NavLink } from "react-router-dom";
import axios from "axios";

const SaleReturnsList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/sale-return`);
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/sale-return/${id}`);
    load();
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1, minWidth: 160 },
    { field: "saleId", headerName: "Sale", flex: 1, minWidth: 160 },
    { field: "returnQuantity", headerName: "Qty", flex: 0.5, minWidth: 80 },
    { field: "returnQuantityType", headerName: "Type", flex: 0.5, minWidth: 80 },
    { field: "returnReason", headerName: "Reason", flex: 1, minWidth: 160 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button color="error" size="small" onClick={() => handleDelete(params.row._id)}>Delete</Button>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Sale Returns</Typography>
        <NavLink to="/sales/returns/create">
          <Button variant="contained">New Sale Return</Button>
        </NavLink>
      </Box>
      <Paper elevation={0} sx={{ p: 1, border: "1px solid", borderColor: "divider" }}>
        <Datagrid rows={rows} columns={columns} loading={loading} />
      </Paper>
    </>
  );
};

export default SaleReturnsList;


