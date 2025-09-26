import React, { useState } from "react";
import { Box, Container, Grid2 as Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Typography, TextField, Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import {
  selectCompanies,
  selectProducts,
} from "../../store/selectors/product.selector";
import { fetchProductsAsync } from "../../store/slices/product.slice";
import { selectCategories } from "../../store/selectors/category.selector";
import Model from "../../components/Model";
import Datagrid from "../../components/DataGrid";
import { selectCompaniesList } from "../../store/selectors/company.selector";

const CreateProduct = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories).categories;
  const companies = useSelector(selectCompaniesList);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "Sample Product",
    type: "Electronics",
    unit: 10,
    sku: "SKU-12345",
    barCode: "9876543210123",
    description: "This is a sample product description.",
    currentStock: 150,
    mainStockLevel: 50,
    purchasedPrice: 200,
    salePrice: 250,
    status: "active",
    companyId: "company123",
    categoryId: "category456",
  });

  // methods
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/products`, product, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setOpen(false);
      setLoading(false);
      toast.success("data added");
      dispatch(fetchProductsAsync({ page: 1, limit: 10 }));
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response.data.message ?? "something went wrong! please try again"
      );
    }
  };

  return (
    <>
      <Model
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        cancel="cancel"
        submit="submit"
        loading={loading}
        disabled={loading}
      >
        <Typography variant="h6" mb={2}>
          Add new Product
        </Typography>

        <Grid container spacing={3} mt={2}>
          {/* ================= General Info ================= */}
          <Grid item xs={12}>
            <Grid>
              <Typography variant="subtitle1" gutterBottom>
                General Information
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                />
                <TextField
                  label="Type"
                  name="type"
                  value={product.type}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Unit"
                  name="unit"
                  type="number"
                  value={product.unit}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  label="SKU"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Barcode"
                  name="barCode"
                  value={product.barCode}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>

          {/* ================= Stock Info ================= */}
          <Grid item xs={12} sx={{ width: "100%" }} mt={2}>
            <Grid>
              <Typography variant="subtitle1" gutterBottom>
                Stock Information
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Current Stock"
                  name="currentStock"
                  type="number"
                  value={product.currentStock}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Main Stock Level"
                  name="mainStockLevel"
                  type="number"
                  value={product.mainStockLevel}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>

          {/* ================= Pricing ================= */}
          <Grid xs={12} sx={{ width: "100%" }} mt={2}>
            <Grid>
              <Typography variant="subtitle1" gutterBottom>
                Pricing
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Purchased Price"
                  name="purchasedPrice"
                  type="number"
                  value={product.purchasedPrice}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Sale Price"
                  name="salePrice"
                  type="number"
                  value={product.salePrice}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* ================= Relations ================= */}
        <Grid xs={12} mt={2}>
          <Grid>
            <Typography variant="subtitle1" gutterBottom>
              Relations
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                select
                fullWidth
                name="status"
                label="Status"
                value={product.status}
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                required
                name="companyId"
                label="Company"
                value={product.companyId}
                onChange={handleChange}
                size="small"
              >
                {companies.map((company) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                required
                name="categoryId"
                label="Category"
                value={product.categoryId}
                onChange={handleChange}
                size="small"
              >
                {categories.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>
      </Model>
    </>
  );
};

const ProductList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedDirection = useSelector(selectDirection);

  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories).categories;
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState("");
  const [selectedItem, setSelectedItem] = useState({
    productName: "",
    categoryId: "",
  });

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleUpdateChanges = (e) => {
    const { name, value } = e.target;
    setSelectedItem((preS) => {
      return {
        ...preS,
        [name]: value,
      };
    });
  };

  const handleClose = () => setOpen(false);
  const handleCloseUpdate = () => setUpdateOpen(false);

  const handleUpdateSubmit = async (event) => {
    event.preventDefault(event);

    const updatedData = {
      name: selectedItem.productName,
      categoryId: selectedItem.categoryId,
    };
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/products/${selectedItem._id}`,
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
      dispatch(fetchProductsAsync({ page: 1, limit: 10 }));
    } catch (error) {
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
      await axios.delete(`http://localhost:5000/api/products/${selectedId}`);
      setOpen(false);
      setLoading(false);
      toast.success("data deleted");
      dispatch(fetchProductsAsync({ page: 1, limit: 10 }));
    } catch (error) {
      setOpen(false);
      setLoading(false);
      toast.error(
        error?.response.data.message ?? "something went wrong! please try again"
      );
    }
  };

  const handleUpdateOpen = (item) => {
    setSelectedItem({ ...item, productName: item.name });
    setUpdateOpen(true);
  };

  const stateChanged = (data) => {};

  const columns = [
    {
      field: "name",
      headerName: "Product Name",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "sku",
      headerName: "SKU",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "barCode",
      headerName: "Barcode",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "currentStock",
      headerName: "Current Stock",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "mainStockLevel",
      headerName: "Main Stock Level",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "purchasedPrice",
      headerName: "Purchase Price",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "salePrice",
      headerName: "Sale Price",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "categoryId",
      headerName: "Category",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
    },
    {
      field: "companyId",
      headerName: "Category",
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
              onClick={() => handleOpen(params.row._id)}
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
            <Model
              open={open}
              handleClose={handleClose}
              handleSubmit={handleConfirm}
              loading={loading}
              submit="delete"
              cancel="cancel"
              disabled={loading}
            >
              <Typography variant="h6" component="h2">
                Are you sure
              </Typography>
              <Typography sx={{ mt: 2 }}>this action cannot be undo</Typography>
            </Model>
            <Model
              open={updateOpen}
              handleClose={handleCloseUpdate}
              submit="update"
              cancel="cancel"
              loading={loading}
              disabled={disableUpdate === selectedItem.productName}
              handleSubmit={handleUpdateSubmit}
            >
              <Stack spacing={2}>
                <Typography variant="h6" mb={2}>
                  update product details
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="productName"
                  name="productName"
                  value={selectedItem.productName}
                  onChange={handleUpdateChanges}
                />
                <TextField
                  select
                  fullWidth
                  required
                  name="categoryId"
                  label={"category"}
                  value={selectedItem.categoryId}
                  onChange={handleUpdateChanges}
                >
                  {categories.map((item, index) => (
                    <MenuItem key={index} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Model>
          </div>
          <Datagrid
            rows={products.products}
            columns={columns}
            totalRows={products.totalRows}
            currentPage={products.currentPage}
            limitPerPage={products?.limitPerPage}
            loading={products?.loading}
            stateChanged={stateChanged}
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
    </>
  );
};

export default Products;
