import React, { useState } from "react";
import { Box, Grid2 as Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
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
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { selectUnits } from "../../store/selectors/unit.selector";

const CreateProduct = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories).categories;
  const companies = useSelector(selectCompaniesList);

  const units = useSelector(selectUnits);

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    minStockLevel: 50,
    categoryId: "",
    companyId: "",
    baseUnitId: "",
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
        <Grid
          container
          spacing={2}
          sx={{
            marginTop: "15px",
          }}
        >
          <Grid size={4} xs={12} sm={6}>
            <TextField
              label="Product Names"
              name="name"
              value={product.name}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />
          </Grid>
          <Grid size={4} xs={12} sm={6}>
            <TextField
              label="Min Stock Level"
              name="minStockLevel"
              type="number"
              value={product.minStockLevel}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={4} xs={12} sm={6}>
            <TextField
              label="Base Unit"
              name="baseUnitId"
              type="number"
              value={product.baseUnitId}
              onChange={handleChange}
              fullWidth
              size="small"
              select
            >
              {units.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  <Typography variant="body1">{`${item.engName}`}</Typography>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Box>
        <Grid xs={12} mt={2}>
          <Grid>
            <Typography variant="subtitle1" gutterBottom>
              Relations
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
                {companies.map((item) => (
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

  const products = useSelector(selectProducts);
  const units = useSelector(selectUnits);
  const companies = useSelector(selectCompaniesList);
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
      field: "minStockLevel",
      headerName: "Main Stock Level",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "baseUnitId",
      headerName: "Base Unit",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: (params) => {
        return params?.row?.baseUnitId
          ? `${params?.row?.baseUnitId?.engName}`
          : "N/A";
      },
    },
    {
      field: "categoryId",
      headerName: "Category",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: (params) => {
        return params?.row?.categoryId
          ? `${params?.row?.categoryId?.name}`
          : "N/A";
      },
    },
    {
      field: "companyId",
      headerName: "Company",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: (params) => {
        return params?.row?.companyId
          ? `${params?.row?.companyId?.name}`
          : "N/A";
      },
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
                <Grid
                  container
                  spacing={2}
                  sx={{
                    marginTop: "15px",
                  }}
                >
                  <Grid size={4} xs={12} sm={6}>
                    <TextField
                      label="Product Names"
                      name="name"
                      value={selectedItem.name}
                      onChange={handleUpdateChanges}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid size={4} xs={12} sm={6}>
                    <TextField
                      label="Min Stock Level"
                      name="minStockLevel"
                      type="number"
                      value={selectedItem.minStockLevel}
                      onChange={handleUpdateChanges}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={4} xs={12} sm={6}>
                    <TextField
                      label="Base Unit"
                      name="baseUnitId"
                      type="number"
                      value={selectedItem.baseUnitId}
                      onChange={handleUpdateChanges}
                      fullWidth
                      size="small"
                      select
                    >
                      {units.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          <Typography variant="body1">{`${item.engName}`}</Typography>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <TextField
                    label="Description"
                    name="description"
                    value={selectedItem.description}
                    onChange={handleUpdateChanges}
                    fullWidth
                    size="small"
                  />
                </Box>
                <Grid xs={12} mt={2}>
                  <Grid>
                    <Typography variant="subtitle1" gutterBottom>
                      Relations
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="categoryId"
                        label="Category"
                        value={selectedItem.categoryId}
                        onChange={handleUpdateChanges}
                        size="small"
                      >
                        {categories.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        fullWidth
                        required
                        name="companyId"
                        label="Company"
                        value={selectedItem.companyId}
                        onChange={handleUpdateChanges}
                        size="small"
                      >
                        {companies.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Grid>
                </Grid>
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
              <ProductionQuantityLimitsIcon
                sx={{ mr: 1, verticalAlign: "middle" }}
              />
              Products Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your Products transactions and customer orders
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            {t("newProduct")}
          </Button>
        </Stack>
      </Paper>
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
