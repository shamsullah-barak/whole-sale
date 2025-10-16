import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Datagrid from "../../components/DataGrid";
import axios from "axios";

const ViewPurchase = () => {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/purchases/${id}/with-items`
        );
        setPurchase(data.purchase);
        setItems(data.items || []);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!purchase) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
      >
        <Typography>Purchase not found</Typography>
      </Paper>
    );
  }

  const columns = [
    {
      field: "productId",
      headerName: "Product Name",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        return params?.row?.productId
          ? `${params?.row?.productId?.name}`
          : "N/A";
      },
    },
    { field: "quantity", headerName: "Qty", flex: 0.5, minWidth: 80 },
    { field: "unitType", headerName: "Type", flex: 0.5, minWidth: 80 },
    {
      field: "unitPerPackage",
      headerName: "Per Pack",
      flex: 0.6,
      minWidth: 100,
    },
    { field: "unitPrice", headerName: "Unit Price", flex: 0.6, minWidth: 120 },
    { field: "totalPrice", headerName: "Total", flex: 0.6, minWidth: 120 },
  ];

  console.log({ items });

  return (
    <>
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 2, border: "1px solid", borderColor: "divider" }}
      >
        <Typography variant="h6" gutterBottom>
          Purchase Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2">
          Payment: {purchase.paymentMethod}
        </Typography>
        <Typography variant="body2">Total: {purchase.totalPrice}</Typography>
      </Paper>
      <Paper
        elevation={0}
        sx={{ p: 1, border: "1px solid", borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ p: 2 }}>
          Items
        </Typography>
        <Datagrid
          rows={items}
          columns={columns}
          autoHeight
          hideFooterSelectedRowCount
        />
      </Paper>
    </>
  );
};

export default ViewPurchase;
