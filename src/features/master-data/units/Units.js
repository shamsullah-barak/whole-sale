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
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StraightenIcon from "@mui/icons-material/Straighten";
import {
  fetchUnitsAsync,
  deleteUnitAsync,
} from "../../../store/slices/unit.slice";
import {
  selectUnits,
  selectUnitsLoading,
} from "../../../store/selectors/unit.selector";
import Model from "../../../components/Model";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../../store/selectors/app.selector";
import COLORS from "../../../constant/colors";

const CreateOrUpdateUnit = ({
  open,
  setOpen,
  isUpdate,
  setIsUpdate,
  updatedUnit,
  setUpdatedUnit,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedDirection = useSelector(selectDirection);

  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState({
    engName: "",
    psName: "",
    drName: "",
  });

  // ✅ Only run when updatedUnit changes
  useEffect(() => {
    if (isUpdate && updatedUnit) {
      setUnit({
        engName: updatedUnit.engName || "",
        psName: updatedUnit.psName || "",
        drName: updatedUnit.drName || "",
      });
    } else {
      setUnit({
        engName: "",
        psName: "",
        drName: "",
      });
    }
  }, [isUpdate, updatedUnit]);

  // Methods
  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
    setUpdatedUnit({});
  };

  const clearState = () => {
    handleClose();
    setUnit({
      engName: "",
      psName: "",
      drName: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = isUpdate
        ? `http://localhost:5000/api/units/${updatedUnit._id}`
        : "http://localhost:5000/api/units";

      const method = isUpdate ? "patch" : "post";
      await axios[method](url, unit, {
        headers: { "Content-Type": "application/json" },
      });

      dispatch(fetchUnitsAsync());
      clearState();
      toast.success(
        isUpdate ? "Unit updated successfully!" : "Unit created successfully!"
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
          {isUpdate ? "Update Unit" : "Add New Unit"}
        </Typography>

        <Grid xs={12} spacing={2}>
          <Grid>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label={t("engName")}
                name="engName"
                type="text"
                value={unit.engName}
                onChange={(e) => setUnit({ ...unit, engName: e.target.value })}
                size="small"
              />
              <TextField
                fullWidth
                label={t("psName")}
                name="psName"
                type="text"
                required
                size="small"
                value={unit.psName}
                onChange={(e) => setUnit({ ...unit, psName: e.target.value })}
              />
              <TextField
                fullWidth
                required
                size="small"
                label={t("drName")}
                name="drName"
                type="text"
                value={unit.drName}
                onChange={(e) => setUnit({ ...unit, drName: e.target.value })}
              />
            </Box>
          </Grid>
        </Grid>
      </Model>
    </>
  );
};

const Units = () => {
  const dispatch = useDispatch();
  const units = useSelector(selectUnits);
  const loading = useSelector(selectUnitsLoading);

  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [updatedUnit, setUpdatedUnit] = useState({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleEdit = (updatedUnit) => {
    setIsUpdate(true);
    setOpen(true);
    setUpdatedUnit(updatedUnit);
  };

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUnit) {
      try {
        await dispatch(
          deleteUnitAsync(selectedUnit.id || selectedUnit._id)
        ).unwrap();
        toast.success("Unit deleted successfully");
        dispatch(fetchUnitsAsync());
      } catch (err) {
        toast.error(err?.message || "Failed to delete unit");
      }
    }
    setDeleteDialogOpen(false);
    setSelectedUnit(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUnit(null);
  };

  const columns = [
    { field: "engName", headerName: "English Name", flex: 1, minWidth: 150 },
    { field: "psName", headerName: "Pashto Name", flex: 1, minWidth: 150 },
    { field: "drName", headerName: "Dari Name", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => handleEdit(params.row)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <CreateOrUpdateUnit
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        open={open}
        setOpen={setOpen}
        updatedUnit={updatedUnit}
        setUpdatedUnit={setUpdatedUnit}
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
                Units Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your units
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
              Create Unit
            </Button>
          </Stack>
        </Paper>

        <Box sx={{ width: "100%", height: 600 }}>
          <DataGrid
            rows={units || []}
            columns={columns}
            getRowId={(row) => row.id || row._id}
            loading={loading}
            density="compact"
          />
        </Box>
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Delete Unit</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the unit "{selectedUnit?.engName}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Units;
