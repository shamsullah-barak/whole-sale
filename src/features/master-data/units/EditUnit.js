import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateUnitAsync,
  getUnitByIdAsync,
  fetchUnitsAsync,
} from "../../../store/slices/unit.slice";
import {
  selectUnitsLoading,
  selectUnitsError,
} from "../../../store/selectors/unit.selector";
import { selectCompaniesList } from "../../../store/selectors/company.selector";
import { fetchCompaniesAsync } from "../../../store/slices/company.slice";

const EditUnit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unitId } = useParams();
  const loading = useSelector(selectUnitsLoading);
  const error = useSelector(selectUnitsError);
  const companies = useSelector(selectCompaniesList);
  const [unit, setUnit] = React.useState(null);

  useEffect(() => {
    dispatch(fetchCompaniesAsync({ page: 1, limit: 100 }));
    dispatch(getUnitByIdAsync(unitId)).then((res) => {
      if (res.payload) setUnit(res.payload);
    });
  }, [dispatch, unitId]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Unit name is required"),
    abbreviation: Yup.string().required("Abbreviation is required"),
    companyId: Yup.string().required("Company is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateUnitAsync({ unitId, unitData: values })).unwrap();
      dispatch(fetchUnitsAsync());
      navigate("/master-data/units");
    } finally {
      setSubmitting(false);
    }
  };

  if (!unit) return null;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper
          elevation={3}
          style={{
            padding: 20,
            marginTop: 20,
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Edit Unit
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Formik
            initialValues={{
              name: unit.name || "",
              abbreviation: unit.abbreviation || "",
              companyId: unit.companyId || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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
                    <MenuItem
                      key={company.id || company._id}
                      value={company.id || company._id}
                    >
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Updating..." : "Update Unit"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </>
  );
};

export default EditUnit;
