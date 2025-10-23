import React, { useState } from "react";
import { Grid, Typography, Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchasesAsync } from "../../store/slices/purchase.slice";
import { selectPurchases } from "../../store/selectors/purchase.selector";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Datagrid from "../../components/DataGrid";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { IconButton, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Model from "../../components/Model";
import COLORS from "../../constant/colors";

const PurchaseList = () => {
  const dispatch = useDispatch();
  const purchases = useSelector(selectPurchases);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchPurchasesAsync({ page: page + 1, limit: pageSize }));
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleEdit = (row) => {
    navigate(`/purchases/edit/${row._id}`);
  };

  const handleView = (row) => {
    navigate(`/purchases/${row._id}`);
  };

  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/purchases/${selectedId}`);
      setOpen(false);
      setLoading(false);
      toast.success("data deleted");
      dispatch(
        fetchPurchasesAsync({
          page: purchases.currentPage,
          limit: purchases.limitPerPage,
        })
      );
    } catch (error) {
      setOpen(false);
      setLoading(false);
      toast.error(
        error?.response.data.message ?? "something went wrong! please try again"
      );
    }
  };

  const columns = getColumns(handleEdit, handleDelete, handleView);

  return (
    <>
      <ToastContainer />
      <Model
        open={open}
        handleClose={handleClose}
        submit="delete"
        cancel="cancel"
        loading={loading}
        disabled={loading}
        handleSubmit={handleConfirm}
      >
        <Typography variant="h6" component="h2">
          Are you sure
        </Typography>
        <Typography sx={{ mt: 2 }}>you cannot undo this action</Typography>
      </Model>
      <Datagrid
        rows={purchases?.purchases}
        columns={columns}
        limitPerPage={purchases?.limitPerPage}
        loading={purchases?.loading}
        totalRows={purchases?.totalRows}
        currentPage={purchases?.currentPage}
        stateChanged={stateChanged}
        onRowClick={(params) => handleView(params.row)}
      />
    </>
  );
};

const getColumns = (handleEdit, handleDelete, handleView) => [
  {
    field: "supplierName",
    headerName: "Supplier",
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => {
      return params?.row?.supplierId
        ? `${params?.row?.supplierId?.name}`
        : "N/A";
    },
  },
  {
    field: "totalPrice",
    headerName: "total price",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },
  {
    field: "discount",
    headerName: "discount",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },
  {
    field: "paymentMethod",
    headerName: "payment method",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 220,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      return (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                handleView(params.row);
              }}
            >
              <ReceiptLongIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(params.row);
              }}
            >
              <ModeEditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(params.row._id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  },
];

export default function DashboardCards() {
  return (
    <>
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Purchases Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your Purchases
            </Typography>
          </Box>
          <NavLink to="/purchases/add">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: COLORS.PURPLE,
                "&:hover": {
                  backgroundColor: COLORS.LIGHT_PURPLE,
                },
              }}
            >
              Create Purchase
            </Button>
          </NavLink>
        </Stack>
      </Paper>
      <PurchaseList />
    </>
  );
}
