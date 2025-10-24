import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { selectDirection } from "../../store/selectors/app.selector";
import { useDispatch, useSelector } from "react-redux";
// removed theme/chart usage
import { selectStocks } from "../../store/selectors/stock.selector";
import Model from "../../components/Model";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  addStockToList,
  fetchStocksAsync,
  deleteStockAsync,
  updateStockAsync,
} from "../../store/slices/stock.slice";
// import StatCard from "../../components/StatCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function StatCard({ title, value, engName, _id, onDelete, onEdit }) {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(_id, title);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(_id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        flexGrow: 1,
        transition: "all 0.3s ease-in-out", // smooth animation
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid divider",
        borderRadius: 3,
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)", // lift and scale on hover
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.3)",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            component="h2"
            variant="subtitle2"
            gutterBottom
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit Stock" placement="top">
              <IconButton size="small" onClick={handleEditClick}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Stock" placement="top">
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  color: "error.main",
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                  border: "1px solid rgba(244, 67, 54, 0.2)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "error.dark",
                    transform: "scale(1.1)",
                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                  },
                  zIndex: 1,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <NavLink
          to={`${_id}/stock-items`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Stack
            direction="column"
            sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
          >
            <Stack sx={{ justifyContent: "space-between" }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h4" component="p">
                  {value}
                </Typography>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                Total Products
              </Typography>
            </Stack>
            <Box sx={{ height: 8 }} />
          </Stack>
        </NavLink>
      </CardContent>
    </Card>
  );
}

const StockList = () => {
  const stocks = useSelector(selectStocks).stocks;
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  const data = {};

  const handleDeleteClick = (stockId, stockName) => {
    setStockToDelete({ id: stockId, name: stockName });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!stockToDelete) return;

    setLoading(true);
    try {
      await dispatch(deleteStockAsync(stockToDelete.id));
      toast.success(`Stock "${stockToDelete.name}" deleted successfully`);
      setDeleteModalOpen(false);
      setStockToDelete(null);
      dispatch(fetchStocksAsync());
    } catch (error) {
      toast.error("Failed to delete stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setStockToDelete(null);
  };

  const handleEdit = (stockId) => {
    const s = stocks.find((x) => x._id === stockId);
    if (!s) return;
    setEditingStock({ ...s });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingStock(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // return console.log({ editingStock });
    const payload = {
      drName: editingStock.stockDrName,
      engName: editingStock.stockEngName,
      psName: editingStock.stockPsName,
      location: editingStock.location,
    };

    if (!editingStock) return;
    setLoading(true);
    try {
      await dispatch(updateStockAsync({ stockId: editingStock._id, payload }));
      toast.success("Stock updated successfully");
      setEditOpen(false);
      dispatch(fetchStocksAsync());
      setEditingStock(null);
    } catch (err) {
      toast.error("Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ mb: (theme) => theme.spacing(2) }}
        >
          {stocks.map((card, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title={card.engName}
                engName={card.engName}
                value={card.productCount}
                _id={card._id}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Delete Confirmation Modal */}
      <Model
        open={deleteModalOpen}
        handleClose={handleDeleteCancel}
        handleSubmit={handleDeleteConfirm}
        loading={loading}
        submit="delete"
        cancel="cancel"
        disabled={loading}
      >
        <Typography variant="h6" component="h2">
          Are you sure?
        </Typography>
        <Typography sx={{ mt: 2 }}>
          You want to delete the stock "{stockToDelete?.name}". This action
          cannot be undone.
        </Typography>
      </Model>

      <Model
        open={editOpen}
        handleClose={handleEditClose}
        handleSubmit={handleEditSubmit}
        loading={loading}
        submit="save"
        cancel="cancel"
        disabled={loading}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Stock
        </Typography>
        {editingStock && (
          <Grid container spacing={2} columns={12}>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="English Name"
                value={editingStock.stockEngName || ""}
                onChange={(e) =>
                  setEditingStock({
                    ...editingStock,
                    stockEngName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Pashto Name"
                value={editingStock.stockPsName || ""}
                onChange={(e) =>
                  setEditingStock({
                    ...editingStock,
                    stockPsName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Dari Name"
                value={editingStock.stockDrName || ""}
                onChange={(e) =>
                  setEditingStock({
                    ...editingStock,
                    stockDrName: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Location"
                value={editingStock.location || ""}
                onChange={(e) =>
                  setEditingStock({ ...editingStock, location: e.target.value })
                }
              />
            </Grid>
          </Grid>
        )}
      </Model>
    </>
  );
};

const CreateStock = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState({
    engName: "",
    psName: "",
    drName: "",
    location: "",
  });

  const selectedDirection = useSelector(selectDirection);
  const dispatch = useDispatch();

  // methods
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/stocks",
        stock,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // dispatch(fetchStocksAsync());
      dispatch(addStockToList({ stock: response.data }));
      toast.success("stock create");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ??
          "something went wrong please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{
            width: "100%",
            textAlign: selectedDirection === "rtl" ? "left" : "right",
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
              color:
                theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
            })}
            onClick={() => setOpen(true)}
          >
            {t("newStock")}
          </Button>
        </Grid>
      </Grid>

      <Model
        open={open}
        handleClose={handleClose}
        submit="submit"
        cancel="cancel"
        loading={loading}
        disabled={loading}
        handleSubmit={handleSubmit}
      >
        <Typography variant="h6" mb={2}>
          Add new Stock
        </Typography>

        <Grid xs={12} spacing={2}>
          <Grid>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label={t("engName")}
                name="engName"
                type="text"
                value={stock.engName}
                onChange={(event) =>
                  setStock({
                    ...stock,
                    engName: event.target.value,
                  })
                }
                size="small"
              />
              <TextField
                fullWidth
                label={t("psName")}
                name="psName"
                type="text"
                required
                size="small"
                value={stock.psName}
                onChange={(event) =>
                  setStock({
                    ...stock,
                    psName: event.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                required
                size="small"
                label={t("drName")}
                name="drName"
                type="text"
                value={stock.drName}
                onChange={(event) =>
                  setStock({
                    ...stock,
                    drName: event.target.value,
                  })
                }
              />
            </Box>
          </Grid>
          <Grid container xs={12} spacing={2} mt={2}>
            <TextField
              fullWidth
              label={t("location")}
              name="location"
              type="text"
              value={stock.location}
              onChange={(event) =>
                setStock({
                  ...stock,
                  location: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      </Model>
    </>
  );
};

const Stock = () => {
  return (
    <>
      <>
        <CreateStock />
        <StockList />
      </>
    </>
  );
};

export default Stock;
