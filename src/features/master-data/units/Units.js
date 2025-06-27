import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainDashboard from '../../../theme/main/MainDashboard';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUnitsAsync, deleteUnitAsync } from '../../../store/slices/unit.slice';
import { selectUnits, selectUnitsLoading, selectUnitsError } from '../../../store/selectors/unit.selector';
import { selectCompaniesList } from '../../../store/selectors/company.selector';
import { fetchCompaniesAsync } from '../../../store/slices/company.slice';

const Units = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const units = useSelector(selectUnits);
  const loading = useSelector(selectUnitsLoading);
  const error = useSelector(selectUnitsError);
  const companies = useSelector(selectCompaniesList);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchUnitsAsync());
    dispatch(fetchCompaniesAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId || c._id === companyId);
    return company ? company.name : companyId;
  };

  const handleEdit = (unitId) => {
    navigate(`/master-data/units/edit/${unitId}`);
  };

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUnit) {
      try {
        await dispatch(deleteUnitAsync(selectedUnit.id || selectedUnit._id)).unwrap();
        setSnackbar({ open: true, message: 'Unit deleted successfully', severity: 'success' });
        dispatch(fetchUnitsAsync());
      } catch (err) {
        setSnackbar({ open: true, message: err?.message || 'Failed to delete unit', severity: 'error' });
      }
    }
    setDeleteDialogOpen(false);
    setSelectedUnit(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUnit(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: 'name', headerName: 'Unit Name', flex: 1, minWidth: 150 },
    {
      field: 'companyId',
      headerName: 'Unit Company',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => getCompanyName(params.value),
    },
    { field: 'abbreviation', headerName: 'Abbreviation', flex: 1, minWidth: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => handleEdit(params.row.id || params.row._id)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDeleteClick(params.row)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <MainDashboard title="Units">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Unit Management
          </Typography>
          <NavLink to="/master-data/units/add" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              New Unit
            </Button>
          </NavLink>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ width: '100%', height: 600 }}>
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
          <DialogContent>Are you sure you want to delete the unit "{selectedUnit?.name}"?</DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainDashboard>
  );
};

export default Units;
