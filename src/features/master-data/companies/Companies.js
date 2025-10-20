import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import StraightenIcon from "@mui/icons-material/Straighten";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchCompaniesAsync,
  deleteCompanyAsync,
  clearError,
} from "../../../store/slices/company.slice";
import {
  selectCompanies,
  selectCompaniesLoading,
} from "../../../store/selectors/company.selector";
import Datagrid from "../../../components/DataGrid";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Model from "../../../components/Model";
import COLORS from "../../../constant/colors";

const CreateOrUpdateCompany = ({
  open,
  setOpen,
  isUpdate,
  setIsUpdate,
  updatedCompany,
  setUpdatedCompany,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState({
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
  });

  // ✅ Only run when updatedCompany changes
  useEffect(() => {
    if (isUpdate && updatedCompany) {
      setCompany({
        name: updatedCompany.name || "",
        address: updatedCompany.address || "",
        contactEmail: updatedCompany.contactEmail || "",
        contactPhone: updatedCompany.contactPhone || "",
      });
    } else {
      setCompany({
        name: "",
        address: "",
        contactEmail: "",
        contactPhone: "",
      });
    }
  }, [isUpdate, updatedCompany]);

  // Methods
  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
    setUpdatedCompany({});
  };

  const clearState = () => {
    handleClose();
    setCompany({
      name: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = isUpdate
        ? `http://localhost:5000/api/companies/${updatedCompany._id}`
        : "http://localhost:5000/api/companies";

      const method = isUpdate ? "patch" : "post";
      await axios[method](url, company, {
        headers: { "Content-Type": "application/json" },
      });

      dispatch(fetchCompaniesAsync());
      clearState();
      toast.success(
        isUpdate
          ? "Company updated successfully!"
          : "Company created successfully!"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Something went wrong, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
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
          {isUpdate ? "Update Company" : "Add New Company"}
        </Typography>

        <Grid container xs={12} spacing={2}>
          <Grid size={6} xs={12} spacing={2}>
            <TextField
              fullWidth
              label={t("name")}
              name="name"
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid size={6} xs={12} spacing={2}>
            <TextField
              fullWidth
              label={t("address")}
              name="address"
              type="text"
              required
              size="small"
              value={company.address}
              onChange={(e) =>
                setCompany({ ...company, address: e.target.value })
              }
            />
          </Grid>
          <Grid size={6} xs={12} spacing={2}>
            <TextField
              fullWidth
              required
              size="small"
              label={t("contactEmail")}
              name="contactEmail"
              type="text"
              value={company.contactEmail}
              onChange={(e) =>
                setCompany({ ...company, contactEmail: e.target.value })
              }
            />
          </Grid>
          <Grid size={6} xs={12} spacing={2}>
            <TextField
              fullWidth
              required
              size="small"
              label={t("contactPhone")}
              name="contactPhone"
              type="text"
              value={company.contactPhone}
              onChange={(e) =>
                setCompany({ ...company, contactPhone: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </Model>
    </>
  );
};

const Companies = () => {
  const dispatch = useDispatch();
  const companies = useSelector(selectCompanies);
  const loading = useSelector(selectCompaniesLoading);
  const companiesList = useSelector((state) => state.companies.companies || []);

  const [open, setOpen] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [updatedCompany, setUpdatedCompany] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCompaniesAsync({ page: 1, limit: companies.limitPerPage }));
    dispatch(clearError());
  }, [dispatch, companies.limitPerPage]);

  const handleDelete = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await dispatch(deleteCompanyAsync(companyToDelete._id)).unwrap();
        dispatch(fetchCompaniesAsync());
        toast.success("Company deleted successfully!");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ??
            "Something went wrong, please try again"
        );
      }
    }
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  const handlePaginationChange = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchCompaniesAsync({ page: page + 1, limit: pageSize }));
  };

  const renderActions = (params) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => handleEdit(params.row)}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={() => handleDelete(params.row)}
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const columns = [
    {
      field: "name",
      headerName: "Company Name",
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: "contactEmail",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: "contactPhone",
      headerName: "Phone",
      flex: 0.8,
      minWidth: 150,
      sortable: true,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1.2,
      minWidth: 200,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: renderActions,
    },
  ];

  const handleEdit = (updatedCompany) => {
    setIsUpdate(true);
    setOpen(true);
    setUpdatedCompany(updatedCompany);
  };

  return (
    <>
      <ToastContainer />
      <CreateOrUpdateCompany
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        open={open}
        setOpen={setOpen}
        updatedCompany={updatedCompany}
        setUpdatedCompany={setUpdatedCompany}
      />
      <Box sx={{ width: "100%" }}>
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
                <StraightenIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Companies Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your companies
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
              Create Company
            </Button>
          </Stack>
        </Paper>

        {/* Data Grid */}
        <Box sx={{ width: "100%", height: 600 }}>
          <Datagrid
            rows={companiesList}
            columns={columns}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: companies?.limitPerPage || 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={handlePaginationChange}
            disableColumnResize
            rowCount={companies.totalRows || 0}
            paginationMode="server"
            pagination
            page={companies.currentPage - 1 || 0}
            pageSize={companies.limitPerPage || 10}
            loading={loading}
            density="compact"
          />
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the company "
              {companyToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Companies;
