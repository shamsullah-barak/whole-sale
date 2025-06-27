import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MainDashboard from '../../theme/main/MainDashboard';
import { NavLink } from 'react-router-dom';

import { TextField, MenuItem, Button, Typography, Grid, Paper, Alert, CircularProgress, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  updateProductAsync,
  getProductByIdAsync,
  fetchCompaniesAsync,
  fetchCategoriesAsync,
  clearError,
} from '../../store/slices/product.slice';
import {
  selectProductsLoading,
  selectProductsError,
  selectSelectedProduct,
  selectCompanies,
  selectCategories,
} from '../../store/selectors/product.selector';

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const selectedProduct = useSelector(selectSelectedProduct);
  const companies = useSelector(selectCompanies);
  const categories = useSelector(selectCategories);

  useEffect(() => {
    if (productId) {
      dispatch(getProductByIdAsync(productId));
    }
    dispatch(fetchCompaniesAsync());
    dispatch(fetchCategoriesAsync());

    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch, productId]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await dispatch(updateProductAsync({ productId, productData: values })).unwrap();
      navigate('/products');
    } catch (error) {
      // Handle validation errors
      if (error.includes('SKU already exists')) {
        setFieldError('sku', 'This SKU already exists');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    unit: Yup.number().min(1).required('Unit is required'),
    description: Yup.string(),
    sku: Yup.string().required('SKU is required'),
    barCode: Yup.string().required('Barcode is required'),
    currentStock: Yup.number().min(0).required('Current stock is required'),
    mainStockLevel: Yup.number().min(0).required('Main stock level is required'),
    purchasedPrice: Yup.number().min(0).required('Purchased price is required'),
    salePrice: Yup.number().min(0).required('Sale price is required'),
    status: Yup.string().required('Status is required'),
    companyId: Yup.string().required('Company is required'),
    categoryId: Yup.string().required('Category is required'),
  });

  if (!selectedProduct && !loading) {
    return (
      <MainDashboard title="Edit Product">
        <Alert severity="error">Product not found</Alert>
      </MainDashboard>
    );
  }

  return (
    <MainDashboard title="Edit Product">
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
          Edit Product
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && !selectedProduct ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : selectedProduct ? (
          <Formik
            initialValues={{
              name: selectedProduct.name || '',
              unit: selectedProduct.unit || 1,
              description: selectedProduct.description || '',
              sku: selectedProduct.sku || '',
              barCode: selectedProduct.barCode || '',
              currentStock: selectedProduct.currentStock || 0,
              mainStockLevel: selectedProduct.mainStockLevel || 0,
              purchasedPrice: selectedProduct.purchasedPrice || 0,
              salePrice: selectedProduct.salePrice || 0,
              status: selectedProduct.status || 'active',
              companyId: selectedProduct.companyId || '',
              categoryId: selectedProduct.categoryId || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleChange, values, errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Product Name"
                      name="name"
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Unit"
                      name="unit"
                      type="number"
                      error={touched.unit && !!errors.unit}
                      helperText={touched.unit && errors.unit}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Field as={TextField} fullWidth label="Description" name="description" />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="SKU"
                      name="sku"
                      error={touched.sku && !!errors.sku}
                      helperText={touched.sku && errors.sku}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Barcode"
                      name="barCode"
                      error={touched.barCode && !!errors.barCode}
                      helperText={touched.barCode && errors.barCode}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Current Stock"
                      name="currentStock"
                      type="number"
                      error={touched.currentStock && !!errors.currentStock}
                      helperText={touched.currentStock && errors.currentStock}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Main Stock Level"
                      name="mainStockLevel"
                      type="number"
                      error={touched.mainStockLevel && !!errors.mainStockLevel}
                      helperText={touched.mainStockLevel && errors.mainStockLevel}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Purchased Price"
                      name="purchasedPrice"
                      type="number"
                      error={touched.purchasedPrice && !!errors.purchasedPrice}
                      helperText={touched.purchasedPrice && errors.purchasedPrice}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Sale Price"
                      name="salePrice"
                      type="number"
                      error={touched.salePrice && !!errors.salePrice}
                      helperText={touched.salePrice && errors.salePrice}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field as={TextField} select fullWidth label="Status" name="status">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Field>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      label="Company"
                      name="companyId"
                      error={touched.companyId && !!errors.companyId}
                      helperText={touched.companyId && errors.companyId}
                    >
                      <MenuItem value="">Select a company</MenuItem>
                      {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      label="Category"
                      name="categoryId"
                      error={touched.categoryId && !!errors.categoryId}
                      helperText={touched.categoryId && errors.categoryId}
                    >
                      <MenuItem value="">Select a category</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, position: 'relative' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Updating Product...' : 'Update Product'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        ) : null}
      </Paper>
    </MainDashboard>
  );
};

export default EditProduct;
