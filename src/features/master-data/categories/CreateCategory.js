import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainDashboard from '../../../theme/main/MainDashboard';
import { NavLink } from 'react-router-dom';

import { TextField, Button, Typography, Grid, Paper, Alert, CircularProgress, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createCategoryAsync, clearError } from '../../../store/slices/category.slice';
import { selectCategoriesLoading, selectCategoriesError } from '../../../store/selectors/category.selector';

const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      await dispatch(createCategoryAsync(values)).unwrap();
      resetForm();
      navigate('/master-data/categories');
    } catch (error) {
      // Handle validation errors
      if (error.includes('Category name already exists')) {
        setFieldError('name', 'This category name already exists');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Category name is required'),
  });

  return (
    <MainDashboard title="Create Category">
      <Grid container spacing={2} columns={12} sx={{ width: '100%' }}>
        <Grid xs={12} lg={9} sx={{ width: '100%', textAlign: 'left' }}>
          <NavLink to="/master-data/categories">
            <Button variant="outlined" sx={{ width: '100px' }}>
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>

      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          Create Category
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            name: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, errors, touched, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Category Name"
                    name="name"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
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
                  {loading ? 'Creating Category...' : 'Create Category'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </MainDashboard>
  );
};

export default CreateCategory;
