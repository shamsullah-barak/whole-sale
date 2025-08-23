import React, { useState } from "react";
import MainDashboard from "../../../theme/main/MainDashboard";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectPartners } from "../../../store/selectors/investment.selector";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Typography, TextField, Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../../store/selectors/app.selector";
import COLORS from "../../../constant/colors";
import { fetchPartnersAsync } from "../../../store/slices/investment.slice";
import Model from "../../../components/Model";
import Datagrid from "../../../components/DataGrid";

const currencyTypes = ["afn", "dollar", "rupee"];

const CreatePartnerModal = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //   states
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    currencyType: "",
  });

  //   selectors
  const selectedDirection = useSelector(selectDirection);

  // methods
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", location: "", currencyType: "" }); // reset form
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(
        `http://localhost:5000/api/investments/partners`,
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
          Add a new partner
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="نوم"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="موقعیت"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            select
            fullWidth
            label={t("currencyType")}
            name="currencyType"
            value={formData.currencyType}
            onChange={(event) => {
              setFormData({
                ...formData,
                currencyType: event.target.value,
              });
            }}
          >
            {currencyTypes.map((item) => (
              <MenuItem key={item} value={item} dir={selectedDirection}>
                {t(`${item}`)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Model>
    </>
  );
};

const PartnerList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const partners = useSelector(selectPartners);
  const selectedDirection = useSelector(selectDirection);

  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    location: "",
    currencyType: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpen = (id) => {
    setSelectedId(id);
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
        `http://localhost:5000/api/investments/partners/${selectedItem.id}`,
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
        `http://localhost:5000/api/investments/partners/${selectedId}`
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
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "location",
      headerName: "Location",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
    },
    {
      field: "currencyType",
      headerName: "Currency Type",
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
      {partners?.length === 0 ? (
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
                update info here
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="نوم"
                  name="name"
                  value={selectedItem.name ?? ""}
                  onChange={handleUpdateChanges}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="موقعیت"
                  name="location"
                  value={selectedItem.location ?? ""}
                  onChange={handleUpdateChanges}
                  fullWidth
                  size="small"
                />
                <TextField
                  select
                  fullWidth
                  label={t("currencyType")}
                  name="currencyType"
                  value={selectedItem.currencyType ?? ""}
                  onChange={(event) => {
                    setSelectedItem({
                      ...selectedItem,
                      currencyType: event.target.value,
                    });
                  }}
                >
                  {currencyTypes.map((item) => (
                    <MenuItem key={item} value={item} dir={selectedDirection}>
                      {t(`${item}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Model>
          </div>
          <Datagrid
            rows={partners}
            columns={columns}
            limitPerPage={partners?.limitPerPage}
            loading={partners?.loading}
            totalRows={partners?.totalRows}
            currentPage={partners?.currentPage}
            stateChanged={stateChanged}
          />
        </>
      )}
    </>
  );
};

const Partners = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selectedDirection = useSelector(selectDirection);

  return (
    <MainDashboard title={t("partners")}>
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
            {t("newPartner")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <PartnerList />
          <CreatePartnerModal open={open} setOpen={setOpen} />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Partners;
