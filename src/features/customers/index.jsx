import React, { useState } from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Typography, TextField, Stack } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { fetchPartnersAsync } from "../../store/slices/investment.slice";
import { fetchCustomersAsync } from "../../store/slices/businessEntity.slice";
import { selectCustomers } from "../../store/selectors/businessEntity.selector";
import Model from "../../components/Model";
import Datagrid from "../../components/DataGrid";

const CreateCustomers = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //   states
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // methods
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", phone: "", address: "" }); // reset form
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
      await axios.post(
        `http://localhost:5000/api/business-entities`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOpen(false);
      setLoading(false);
      toast.success("data added");
      dispatch(fetchCustomersAsync({ page: 1, limit: 10 }));
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
          Add new Customers
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            size="small"
          />{" "}
          <TextField
            label="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Stack>
      </Model>
    </>
  );
};

const CustomerList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedDirection = useSelector(selectDirection);

  const customers = useSelector(selectCustomers);

  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleCloseUpdate = () => setUpdateOpen(false);

  const handleUpdateSubmit = async (event) => {
    event.preventDefault(event);

    const updatedData = {
      name: selectedItem.name,
      phone: selectedItem.phone,
      address: selectedItem.address,
    };
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/${selectedItem.id}`,
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
      await axios.delete(`http://localhost:5000/api/${selectedId}`);
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
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "phone",
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
      {customers.customers.length === 0 ? (
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
                Are you sure
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
                update info
              </Typography>
            </Model>
          </div>

          <Datagrid
            rows={customers?.customers}
            columns={columns}
            limitPerPage={customers?.limitPerPage}
            loading={customers?.loading}
            totalRows={customers?.totalRows}
            currentPage={customers?.currentPage}
            stateChanged={stateChanged}
          />
        </>
      )}
    </>
  );
};

const Customers = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selectedDirection = useSelector(selectDirection);

  return (
    <MainDashboard title={t("customers")}>
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
            {t("newCustomer")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <CustomerList />
          <CreateCustomers open={open} setOpen={setOpen} />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Customers;
