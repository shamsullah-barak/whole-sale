import React, { useState } from "react";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { fetchPartnersAsync } from "../../store/slices/investment.slice";
import { selectExpenses } from "../../store/selectors/expenses.selector";
import Model from "../../components/Model";
import Datagrid from "../../components/DataGrid";

const ExpensesList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const expenses = useSelector(selectExpenses);

  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    location: "",
    currencyType: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpen = (_id) => {
    setSelectedId(_id);
    setOpen(true);
  };

  const handleUpdateChanges = (e) => {
    setSelectedItem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => setOpen(false);
  const handleCloseUpdate = () => setUpdateOpen(false);

  const handleUpdateSubmit = async (event) => {
    event.preventDefault(event);

    const updatedData = {
      name: selectedItem.name,
      location: selectedItem.location,
      currencyType: selectedItem.currencyType,
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

  const stateChanged = (data) => {};

  const columns = [
    {
      field: "reason",
      headerName: "reason",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "type",
      headerName: "type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
    },
    {
      field: "amount",
      headerName: "amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
    },
    {
      field: "description",
      headerName: "description",
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
      {expenses?.expenses?.length === 0 ? (
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
              submit="delete"
              cancel="cancel"
              loading={loading}
              disabled={loading}
              handleSubmit={handleConfirm}
            >
              <Typography variant="h6" component="h2">
                are you sure?
              </Typography>
              <Typography sx={{ mt: 2 }}>
                you cannot undo this action
              </Typography>
            </Model>
            <Model
              open={updateOpen}
              handleClose={handleCloseUpdate}
              submit="update"
              cancel="cancel"
              loading={loading}
              disabled={loading}
              handleSubmit={handleUpdateSubmit}
            >
              <Typography variant="h6" mb={2}>
                update info here
              </Typography>
            </Model>
          </div>
          <Datagrid
            rows={expenses?.expenses}
            columns={columns}
            limitPerPage={expenses?.limitPerPage}
            loading={expenses?.loading}
            totalRows={expenses?.totalRows}
            currentPage={expenses?.currentPage}
            stateChanged={stateChanged}
          />
        </>
      )}
    </>
  );
};

const Expenses = () => {
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
            {t("newExpense")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <ExpensesList />
        </Grid>
      </Grid>
    </>
  );
};

export default Expenses;
