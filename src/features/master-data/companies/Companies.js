import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { NavLink } from 'react-router-dom';
import { fetchCompaniesAsync, deleteCompanyAsync, clearError } from '../../../store/slices/company.slice';
import { selectCompanies, selectCompaniesLoading, selectCompaniesError } from '../../../store/selectors/company.selector';

const Companies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companies = useSelector(selectCompanies);
  const loading = useSelector(selectCompaniesLoading);
  const error = useSelector(selectCompaniesError);
  const companiesList = useSelector((state) => state.companies.companies || []);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [companyToDelete, setCompanyToDelete] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    dispatch(fetchCompaniesAsync({ page: 1, limit: companies.limitPerPage }));
    dispatch(clearError());
  }, [dispatch, companies.limitPerPage]);

  const handleEdit = (company) => {
    navigate(`/master-data/companies/edit/${company.id}`);
  };

  const handleDelete = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await dispatch(deleteCompanyAsync(companyToDelete.id)).unwrap();
        setSnackbarMessage('Company deleted successfully');
        setSnackbarOpen(true);
        // Refresh the companies list
        dispatch(fetchCompaniesAsync({ page: companies.currentPage, limit: companies.limitPerPage }));
      } catch (error) {
        setSnackbarMessage('Failed to delete company');
        setSnackbarOpen(true);
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
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={() => handleDelete(params.row)} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const columns = [
    { field: 'name', headerName: 'Company Name', flex: 1, minWidth: 200, sortable: true },
    { field: 'contactEmail', headerName: 'Email', flex: 1, minWidth: 200, sortable: true },
    { field: 'contactPhone', headerName: 'Phone', flex: 0.8, minWidth: 150, sortable: true },
    { field: 'businessType', headerName: 'Business Type', flex: 1, minWidth: 150, sortable: true },
    { field: 'subscriptionStatus', headerName: 'Subscription Status', flex: 1, minWidth: 150, sortable: true },
    {
      field: 'isActive',
      headerName: 'Active',
      flex: 0.5,
      minWidth: 100,
      sortable: true,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    { field: 'address', headerName: 'Address', flex: 1.2, minWidth: 200, sortable: true },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 150,
      sortable: true,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: renderActions,
    },
  ];

  return (
    <MainDashboard title="Companies">
      <Box sx={{ width: '100%' }}>
        {/* Header with title and add button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Company Management
          </Typography>
          <NavLink to="/master-data/companies/add" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              New Company
            </Button>
          </NavLink>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Data Grid */}
        <Box sx={{ width: '100%', height: 600 }}>
          <DataGrid
            rows={companiesList}
            columns={columns}
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
            initialState={{
              pagination: { paginationModel: { pageSize: companies?.limitPerPage || 10 } },
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
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the company "{companyToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </MainDashboard>
  );
};

export default Companies;
