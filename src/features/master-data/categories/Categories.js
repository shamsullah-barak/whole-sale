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
import { fetchCategoriesAsync, deleteCategoryAsync, clearError } from '../../../store/slices/category.slice';
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../../store/selectors/category.selector';

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    dispatch(fetchCategoriesAsync({ page: 1, limit: categories.limitPerPage }));
    dispatch(clearError());
  }, [dispatch, categories.limitPerPage]);

  const handleEdit = (category) => {
    navigate(`/master-data/categories/edit/${category.id}`);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await dispatch(deleteCategoryAsync(categoryToDelete.id)).unwrap();
        setSnackbarMessage('Category deleted successfully');
        setSnackbarOpen(true);
        // Refresh the categories list
        dispatch(fetchCategoriesAsync({ page: categories.currentPage, limit: categories.limitPerPage }));
      } catch (error) {
        setSnackbarMessage('Failed to delete category');
        setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handlePaginationChange = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchCategoriesAsync({ page: page + 1, limit: pageSize }));
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
    {
      field: 'name',
      headerName: 'Category Name',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 150,
      sortable: true,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      },
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
    <MainDashboard title="Categories">
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
            Category Management
          </Typography>
          <NavLink to="/master-data/categories/add" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              New Category
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
            rows={categories?.categories || []}
            columns={columns}
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
            initialState={{
              pagination: { paginationModel: { pageSize: categories?.limitPerPage || 10 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={handlePaginationChange}
            disableColumnResize
            rowCount={categories.totalRows || 0}
            paginationMode="server"
            pagination
            page={categories.currentPage - 1 || 0}
            pageSize={categories.limitPerPage || 10}
            loading={loading}
            density="compact"
          />
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
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

export default Categories;
