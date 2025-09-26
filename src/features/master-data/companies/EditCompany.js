import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Box,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  updateCompanyAsync,
  getCompanyByIdAsync,
  clearError,
} from "../../../store/slices/company.slice";
import {
  selectCompaniesLoading,
  selectCompaniesError,
  selectSelectedCompany,
} from "../../../store/selectors/company.selector";

const EditCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyId } = useParams();

  const loading = useSelector(selectCompaniesLoading);
  const error = useSelector(selectCompaniesError);
  const selectedCompany = useSelector(selectSelectedCompany);

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyByIdAsync(companyId));
    }

    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch, companyId]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await dispatch(
        updateCompanyAsync({ companyId, companyData: values })
      ).unwrap();
      navigate("/master-data/companies");
    } catch (error) {
      // Handle validation errors
      if (error.includes("Company name already exists")) {
        setFieldError("name", "This company name already exists");
      }
      if (error.includes("Email already exists")) {
        setFieldError("email", "This email already exists");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const businessTypes = [
    "Retail",
    "Wholesale",
    "Manufacturing",
    "Service",
    "Other",
  ];
  const subscriptionStatuses = ["active", "inactive", "pending"];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Company name is required"),
    address: Yup.string().required("Address is required"),
    businessType: Yup.string().required("Business type is required"),
    subscriptionStatus: Yup.string()
      .oneOf(subscriptionStatuses)
      .required("Subscription status is required"),
    contactEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    contactPhone: Yup.string().required("Phone number is required"),
    website: Yup.string().url("Invalid URL format"),
    description: Yup.string(),
    subscriptionPlan: Yup.string(),
    logo: Yup.string(),
    isActive: Yup.boolean(),
  });

  if (!selectedCompany && !loading) {
    return (
      <>
        <Alert severity="error">Company not found</Alert>
      </>
    );
  }

  return (
    <>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", textAlign: "left" }}>
          <NavLink to="/master-data/companies">
            <Button variant="outlined" sx={{ width: "100px" }}>
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>

      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          Edit Company
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && !selectedCompany ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : selectedCompany ? (
          <Formik
            initialValues={{
              name: selectedCompany.name || "",
              address: selectedCompany.address || "",
              businessType: selectedCompany.businessType || "",
              subscriptionStatus:
                selectedCompany.subscriptionStatus || "inactive",
              contactEmail: selectedCompany.contactEmail || "",
              contactPhone: selectedCompany.contactPhone || "",
              website: selectedCompany.website || "",
              description: selectedCompany.description || "",
              subscriptionPlan: selectedCompany.subscriptionPlan || "",
              logo: selectedCompany.logo || "",
              isActive: selectedCompany.isActive || false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              handleChange,
              values,
              errors,
              touched,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Company Name"
                      name="name"
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      error={touched.contactEmail && !!errors.contactEmail}
                      helperText={touched.contactEmail && errors.contactEmail}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Contact Phone"
                      name="contactPhone"
                      error={touched.contactPhone && !!errors.contactPhone}
                      helperText={touched.contactPhone && errors.contactPhone}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Website"
                      name="website"
                      error={touched.website && !!errors.website}
                      helperText={touched.website && errors.website}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Address"
                      name="address"
                      multiline
                      rows={2}
                      error={touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={4}
                      error={touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Business Type"
                      name="businessType"
                      select
                      value={values.businessType}
                      onChange={handleChange}
                      error={touched.businessType && !!errors.businessType}
                      helperText={touched.businessType && errors.businessType}
                    >
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Subscription Status"
                      name="subscriptionStatus"
                      select
                      value={values.subscriptionStatus}
                      onChange={handleChange}
                      error={
                        touched.subscriptionStatus &&
                        !!errors.subscriptionStatus
                      }
                      helperText={
                        touched.subscriptionStatus && errors.subscriptionStatus
                      }
                    >
                      {subscriptionStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Subscription Plan"
                      name="subscriptionPlan"
                      error={
                        touched.subscriptionPlan && !!errors.subscriptionPlan
                      }
                      helperText={
                        touched.subscriptionPlan && errors.subscriptionPlan
                      }
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Logo URL"
                      name="logo"
                      error={touched.logo && !!errors.logo}
                      helperText={touched.logo && errors.logo}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.isActive}
                          onChange={(e) =>
                            setFieldValue("isActive", e.target.checked)
                          }
                          name="isActive"
                          color="primary"
                        />
                      }
                      label="Is Active"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, position: "relative" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? "Updating Company..." : "Update Company"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        ) : null}
      </Paper>
    </>
  );
};

export default EditCompany;
