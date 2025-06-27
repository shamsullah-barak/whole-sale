import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainDashboard from '../../../theme/main/MainDashboard';
import { Box, Typography, Button, Paper, TextField, Alert, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createUnitAsync, clearError } from '../../../store/slices/unit.slice';
import { selectUnitsLoading, selectUnitsError } from '../../../store/selectors/unit.selector';
import { useNavigate } from 'react-router-dom';
import { selectCompanies, selectCompaniesLoading } from '../../../store/selectors/company.selector';
import { fetchCompaniesAsync } from '../../../store/slices/company.slice';

const CreateUnit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectUnitsLoading);
  const error = useSelector(selectUnitsError);
  const companies = useSelector((state) => state.companies.companies || []);
  const companiesLoading = useSelector(selectCompaniesLoading);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Unit name is required'),
    abbreviation: Yup.string().required('Abbreviation is required'),
    companyId: Yup.string().required('Company is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(createUnitAsync(values)).unwrap();
      resetForm();
      navigate('/master-data/units');
    } catch (e) {
      // error handled by slice
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    dispatch(fetchCompaniesAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  return (
    <MainDashboard title="Add Unit">
      <Box sx={{ width: '100%' }}>
        <Paper elevation={3} style={{ padding: 20, marginTop: 20, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Add New Unit
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Formik
            initialValues={{ name: '', abbreviation: '', companyId: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values, handleChange }) => (
              <Form>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  label="Company"
                  name="companyId"
                  value={values.companyId}
                  onChange={handleChange}
                  error={touched.companyId && !!errors.companyId}
                  helperText={touched.companyId && errors.companyId}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="">Select a company</MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.id || company._id} value={company.id || company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  fullWidth
                  label="Unit Name"
                  name="name"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 2 }}
                />
                <Field
                  as={TextField}
                  fullWidth
                  label="Abbreviation"
                  name="abbreviation"
                  error={touched.abbreviation && !!errors.abbreviation}
                  helperText={touched.abbreviation && errors.abbreviation}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting || loading}>
                  {loading ? 'Adding...' : 'Add Unit'}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </MainDashboard>
  );
};

export default CreateUnit;
