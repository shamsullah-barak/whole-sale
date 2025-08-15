import React, { useState } from "react";
import MainDashboard from "../../../theme/main/MainDashboard";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Modal, Typography, TextField, Stack } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../../store/selectors/app.selector";
import COLORS from "../../../constant/colors";
import { selectCategories } from "../../../store/selectors/category.selector";
import { fetchCategoriesAsync } from "../../../store/slices/category.slice";

const CreateCategory = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  //   states
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // methods
  const handleClose = () => {
    setOpen(false);
    setCategoryName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:5000/api/categories`,
        { name: categoryName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOpen(false);
      setLoading(false);
      toast.success("data added");
      dispatch(fetchCategoriesAsync({ page: 1, limit: 10 }));
    } catch (error) {
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
            Add new Category
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="categoryName"
              name="categoryName"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
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
                disabled={loading}
                loading={loading}
                loadingPosition="start"
                color="inherit"
                sx={(theme) => ({
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? COLORS.WHITE
                      : COLORS.PURPLE,
                  color:
                    theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
                })}
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

const CategoryList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedDirection = useSelector(selectDirection);
  const categories = useSelector(selectCategories);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({ categoryName: "" });
  const [loading, setLoading] = useState(false);

  const [disableUpdate, setDisableUpdate] = useState("");

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleUpdateChanges = (event) => {
    setSelectedItem((pre) => {
      return {
        ...pre,
        categoryName: event.target.value,
      };
    });
  };

  const handleClose = () => setOpen(false);
  const handleCloseUpdate = () => setUpdateOpen(false);

  const handleUpdateOpen = (item) => {
    setSelectedItem({ id: item.id, categoryName: item.name });
    setDisableUpdate(item.name);
    setUpdateOpen(true);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault(event);

    const data = { name: selectedItem.categoryName };
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/categories/${selectedItem.id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUpdateOpen(false);
      setLoading(false);
      toast.success("data updated");
      dispatch(fetchCategoriesAsync({ page: 1, limit: 10 }));
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
      await axios.delete(`http://localhost:5000/api/categories/${selectedId}`);
      setOpen(false);
      setLoading(false);
      toast.success("data deleted");
      dispatch(fetchCategoriesAsync({ page: 1, limit: 10 }));
    } catch (error) {
      setOpen(false);
      setLoading(false);
      toast.error(
        error?.response.data.message ?? "something went wrong! please try again"
      );
    }
  };

  const handleRowClick = () => {};
  const stateChanged = (data) => {};

  const columns = [
    {
      field: "name",
      headerName: "Category Name",
      flex: 0.5,
      minWidth: 80,
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
      {categories.categories.length === 0 ? (
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
                  Are you sure
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  this action cannot be undo
                </Typography>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    onClick={handleClose}
                    color="secondary"
                    variant="outlined"
                  >
                    cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    disabled={loading}
                    loading={loading}
                    loadingPosition="start"
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
                    delete
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
                  update category
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="categoryName"
                  name="categoryName"
                  value={selectedItem.categoryName}
                  onChange={handleUpdateChanges}
                />
                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    onClick={handleCloseUpdate}
                    color="secondary"
                    variant="outlined"
                  >
                    cancel
                  </Button>
                  <Button
                    onClick={handleUpdateSubmit}
                    color="error"
                    variant="contained"
                    disabled={disableUpdate === selectedItem.categoryName}
                    loading={loading}
                    loadingPosition="start"
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
                    update
                  </Button>
                </Box>
              </Box>
            </Modal>
          </div>
          <DataGrid
            rows={categories?.categories}
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
                paginationModel: { pageSize: categories?.limitPerPage },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(data) => stateChanged(data)}
            disableColumnResize
            rowCount={categories?.totalRows}
            paginationMode="server"
            pagination
            page={categories?.currentPage}
            pageSize={categories?.limitPerPage}
            loading={categories?.loading}
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

const Category = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selectedDirection = useSelector(selectDirection);

  return (
    <MainDashboard title={t("Category")}>
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
            {t("newCategory")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <CategoryList />
          <CreateCategory open={open} setOpen={setOpen} />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Category;
