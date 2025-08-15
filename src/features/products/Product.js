import MainDashboard from "../../theme/main/MainDashboard";
import ProductFilters from "./ProductFilters";
import { NavLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { selectPartners } from "../../store/selectors/investment.selector";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Modal, Typography, TextField, Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { fetchPartnersAsync } from "../../store/slices/investment.slice";
import { fetchCustomersAsync } from "../../store/slices/businessEntity.slice";
import { selectCustomers } from "../../store/selectors/businessEntity.selector";
import { selectProducts } from "../../store/selectors/product.selector";

const CreateProduct = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //   states
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    address: "",
  });

  //   selectors
  const selectedDirection = useSelector(selectDirection);

  // methods
  const handleClose = () => {
    setOpen(false);
    setFormData({ productName: "", productType: "", address: "" }); // reset form
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    formData.type = "customer";
    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/products`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setOpen(false);
      setLoading(false);
      toast.success("data added");
      dispatch(fetchCustomersAsync({ page: 1, limit: 10 }));
    } catch (error) {
      console.log(error);
      setOpen(false);
      setLoading(false);
      toast.error(
        error?.response.data.message ?? "something went wrong! please try again"
      );
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add new Product
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="productType"
              name="productType"
              type="text"
              value={formData.productType}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
              >
                cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={loading}
                loading={loading}
                loadingPosition="start"
              >
                submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

const ProductList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedDirection = useSelector(selectDirection);

  const products = useSelector(selectProducts);

  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    productName: "",
    productType: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleUpdateChanges = (e) => {
    setSelectedItem((prev) => ({
      ...prev,
      [e.target.productName]: e.target.value,
    }));
  };

  const handleClose = () => setOpen(false);
  const handleCloseUpdate = () => setUpdateOpen(false);

  const handleUpdateSubmit = async (event) => {
    event.preventDefault(event);

    const updatedData = {
      productName: selectedItem.productName,
      type: selectedItem.type,
      address: selectedItem.address,
    };
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/investments/expenses/${selectedItem.id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUpdateOpen(false);
      setLoading(false);
      toast.success("data updated");
      dispatch(fetchPartnersAsync());
    } catch (error) {
      console.log(error);
      setUpdateOpen(false);
      setLoading(false);
      toast.error(
        error?.response.data.message ?? "something went wrong! please try again"
      );
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/investments/expenses/${selectedId}`
      );
      setOpen(false);
      setLoading(false);
      toast.success("data deleted");
      dispatch(fetchPartnersAsync());
    } catch (error) {
      console.log(error);
      setOpen(false);
      setLoading(false);
      toast.error(
        error?.response.data.message ?? "something went wrong! please try again"
      );
    }
  };

  const handleUpdateOpen = (item) => {
    setSelectedItem({ ...item });
    setUpdateOpen(true);
  };

  const handleRowClick = () => {};
  const stateChanged = (data) => {};

  const columns = [
    {
      field: "productName",
      headerName: "Name",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "type",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <ModeEditIcon
              sx={{
                color: "blue",
                cursor: "pointer",
                "&:hover": {
                  color: "lightblue",
                },
              }}
              onClick={() => handleUpdateOpen(params.row)}
            />
            <DeleteIcon
              sx={{
                color: "red",
                cursor: "pointer",
                "&:hover": {
                  color: "darkred",
                },
              }}
              onClick={() => handleOpen(params.row.id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ToastContainer />
      {products.products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          {t("No Data found")}
        </div>
      ) : (
        <>
          <div>
            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography variant="h6" component="h2">
                  آیا ډاډه یې؟
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  که ته دا عمل ترسره کوې، نو بیا نه شي بېرته اخیستل کېدای!
                </Typography>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    onClick={handleClose}
                    color="secondary"
                    variant="outlined"
                  >
                    لغوه
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    disabled={loading}
                    loading={loading}
                    loadingPosition="start"
                  >
                    تائید
                  </Button>
                </Box>
              </Box>
            </Modal>
            <Modal open={updateOpen} onClose={handleCloseUpdate}>
              {/* update data model here */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography variant="h6" mb={2}>
                  معلومات اپډیټ کړي
                </Typography>
              </Box>
            </Modal>
          </div>
          <DataGrid
            rows={products?.products}
            style={{
              cursor: "pointer",
              textAlign: selectedDirection === "rtl" ? "left" : "right",
            }}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: products?.limitPerPage },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(data) => stateChanged(data)}
            disableColumnResize
            rowCount={products?.totalRows}
            paginationMode="server"
            pagination
            page={products?.currentPage}
            pageSize={products?.limitPerPage}
            loading={products?.loading}
            density="compact"
            slotProps={{
              filterPanel: {
                filterFormProps: {
                  logicOperatorInputProps: {
                    variant: "outlined",
                    size: "small",
                  },
                  columnInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  operatorInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  valueInputProps: {
                    InputComponentProps: {
                      variant: "outlined",
                      size: "small",
                    },
                  },
                },
              },
            }}
          />
        </>
      )}
    </>
  );
};

const Products = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selectedDirection = useSelector(selectDirection);

  return (
    <MainDashboard title={t("products")}>
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
            {t("newProduct")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <ProductList />
          <CreateProduct open={open} setOpen={setOpen} />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Products;
