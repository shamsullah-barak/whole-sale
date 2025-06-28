import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { createProductColumns } from '../internals/data/gridData';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, deleteProductAsync } from '../store/slices/product.slice';
import { selectProducts, selectProductsLoading, selectProductsError } from '../store/selectors/product.selector';
import { selectUnits } from '../store/selectors/unit.selector';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert, Snackbar } from '@mui/material';

const CustomizedDataGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const units = useSelector(selectUnits);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadProducts = () => {
      dispatch(fetchProductsAsync({ page: 1, limit: products.limitPerPage }));
    };
    loadProducts();
  }, [dispatch, products.limitPerPage]);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchProductsAsync({ page: page + 1, limit: pageSize }));
  };

  const handleEdit = (product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleView = (product) => {
    navigate(`/products/view/${product.id}`);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await dispatch(deleteProductAsync(productToDelete.id)).unwrap();
        setSnackbarMessage('Product deleted successfully');
        setSnackbarOpen(true);
        // Refresh the products list
        dispatch(fetchProductsAsync({ page: products.currentPage, limit: products.limitPerPage }));
      } catch (error) {
        setSnackbarMessage('Failed to delete product');
        setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Map unitId to unit name
  const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId || u._id === unitId);
    return unit ? unit.name : unitId;
  };

  // Pass getUnitName to columns
  const columns = createProductColumns(handleEdit, handleDelete, handleView, getUnitName);

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={products?.products || []}
        columns={columns}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        initialState={{
          pagination: { paginationModel: { pageSize: products?.limitPerPage || 10 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        onPaginationModelChange={(data) => stateChanged(data)}
        disableColumnResize
        rowCount={products.totalRows || 0}
        paginationMode="server"
        pagination
        page={products.currentPage - 1 || 0}
        pageSize={products.limitPerPage || 10}
        loading={loading}
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
            },
          },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
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
    </>
  );
};

export default CustomizedDataGrid;
