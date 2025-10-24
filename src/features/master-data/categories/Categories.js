import React, { useState } from "react";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Typography, TextField, Stack } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../../store/selectors/app.selector";
import COLORS from "../../../constant/colors";
import { selectCategories } from "../../../store/selectors/category.selector";
import { fetchCategoriesAsync } from "../../../store/slices/category.slice";
import Datagrid from "../../../components/DataGrid";
import Model from "../../../components/Model";

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
        </Stack>
      </Model>
    </>
  );
};

const CategoryList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
            <Model
              open={open}
              handleClose={handleClose}
              submit="update"
              cancel="cancel"
              loading={loading}
              disabled={loading}
              handleSubmit={handleConfirm}
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
              disabled={disableUpdate === selectedItem.categoryName}
              handleSubmit={handleUpdateSubmit}
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
            </Model>
          </div>
          <Datagrid
            rows={categories?.categories}
            columns={columns}
            limitPerPage={categories?.limitPerPage}
            loading={categories?.loading}
            totalRows={categories?.totalRows}
            currentPage={categories?.currentPage}
            stateChanged={stateChanged}
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
    </>
  );
};

export default Category;
