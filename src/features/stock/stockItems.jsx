import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { useParams, NavLink } from "react-router-dom";
import { selectDirection } from "../../store/selectors/app.selector";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockItemsAsync } from "../../store/slices/stock.items.slice";
import { selectStockItems } from "../../store/selectors/stock.items.selector";
import Datagrid from "../../components/DataGrid";
import formatDate from "../../utils/moment";
import { Button, Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { toast, ToastContainer } from "react-toastify";
import Model from "../../components/Model";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const getColumns = (handleDelete) => [
  {
    field: "productName",
    headerName: "productName",
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => {
      return params?.row?.productId ? `${params?.row?.productId?.name}` : "N/A";
    },
  },
  {
    field: "quantity",
    headerName: "purchased quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "unitType",
    headerName: "unit type",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
    renderCell: (params) => {
      return params?.row?.productId?.baseUnitId?.engName
        ? `${params.row.productId.baseUnitId.engName}`
        : "N/A";
    },
  },

  {
    field: "availableQty",
    headerName: "available quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "soldQty",
    headerName: "sold quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "returnedQty",
    headerName: "returned quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "createdAt",
    headerName: "purchaseDate",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return formatDate(params);
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton
          size="small"
          color="error"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(params.row._id);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
];

const StockItemsList = () => {
  const stockItems = useSelector(selectStockItems);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const columns = getColumns(handleDelete);

  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/stocks/${id}/stock-items/${selectedId}`
      );
      setOpen(false);
      setLoading(false);
      toast.success("data deleted");
      dispatch(
        fetchStockItemsAsync({
          id,
          page: stockItems.currentPage,
          limit: stockItems.limitPerPage,
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

  const stateChanged = () =>
    // data
    {
      // const { page, pageSize } = data;
      // dispatch(
      //   fetchStockItemsAsync({ stockName, page: page + 1, limit: pageSize })
      // );
    };

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
        rows={stockItems?.stockItems}
        columns={columns}
        limitPerPage={stockItems?.limitPerPage}
        loading={stockItems?.loading}
        totalRows={stockItems?.totalRows}
        currentPage={stockItems?.currentPage}
        stateChanged={stateChanged}
      />
    </>
  );
};

const StockItems = () => {
  const selectedDirection = useSelector(selectDirection);
  const stockItems = useSelector(selectStockItems);

  const { t } = useTranslation();

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      const loadStockItems = () => {
        dispatch(
          fetchStockItemsAsync({
            id,
            page: stockItems.currentPage,
            limit: stockItems.limitPerPage,
          })
        );
      };

      loadStockItems();
    }
  }, [dispatch, id]);

  return (
    <>
      <>
        <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
          <Grid
            xs={12}
            lg={9}
            sx={{
              width: "100%",
              textAlign: selectedDirection === "rtl" ? "left" : "right",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <NavLink to={`/stocks/${id}/add-item`}>
                <Button
                  variant="contained"
                  color="inherit"
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? COLORS.WHITE
                        : COLORS.PURPLE,
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.BLACK
                        : COLORS.WHITE,
                  })}
                >
                  {t("Add New Item")}
                </Button>
              </NavLink>
            </Box>
            <StockItemsList />
          </Grid>
        </Grid>
      </>
    </>
  );
};

export default StockItems;
