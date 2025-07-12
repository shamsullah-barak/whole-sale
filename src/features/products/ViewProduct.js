import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';
import MainDashboard from '../../theme/main/MainDashboard';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Grid } from '@mui/material';
import { getProductByIdAsync, fetchCompaniesAsync, fetchCategoriesAsync } from '../../store/slices/product.slice';
import { fetchUnitsAsync } from '../../store/slices/unit.slice';
import {
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError,
  selectCompanies,
  selectCategories,
} from '../../store/selectors/product.selector';
import { selectUnits } from '../../store/selectors/unit.selector';

const ViewProduct = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const product = useSelector(selectSelectedProduct);
  const companies = useSelector(selectCompanies);
  const categories = useSelector(selectCategories);
  const units = useSelector(selectUnits);

  useEffect(() => {
    if (productId) {
      dispatch(getProductByIdAsync(productId));
    }
    dispatch(fetchCompaniesAsync());
    dispatch(fetchCategoriesAsync());
    dispatch(fetchUnitsAsync());
  }, [dispatch, productId]);

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId || c._id === companyId);
    return company ? company.name : companyId;
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId || c._id === categoryId);
    return category ? category.name : categoryId;
  };
  const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId || u._id === unitId);
    return unit ? `${unit.name} (${unit.abbreviation})` : unitId;
  };

  if (loading && !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!product) {
    return <Alert severity="error">Product not found</Alert>;
  }

  return (
    <MainDashboard title="Product Details">
      <Grid container spacing={2} columns={12} sx={{ width: '100%' }}>
        <Grid xs={12} lg={9} sx={{ width: '100%', textAlign: 'left' }}>
          <NavLink to="/products">
            <Button variant="outlined" sx={{ width: '100px' }}>
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          SKU: {product.sku}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Barcode: {product.barCode}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Company: {getCompanyName(product.companyId)}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Category: {getCategoryName(product.categoryId)}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Unit: {getUnitName(product.unitId)}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Description: {product.description}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Current Stock: {product.currentStock}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Main Stock Level: {product.mainStockLevel}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Purchased Price: {product.purchasedPrice}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Sale Price: {product.salePrice}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Status: {product.status}
        </Typography>
      </Paper>
    </MainDashboard>
  );
};

export default ViewProduct;
