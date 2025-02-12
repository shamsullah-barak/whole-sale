import React, { useEffect, useState } from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { NavLink } from "react-router-dom";

import {
  TextField,
  MenuItem,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Grid2,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
// import { getCompanies, getCategories, createProduct } from "../api/api";

const CreateProduct = () => {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setCompanies(await getCompanies());
  //     setCategories(await getCategories());
  //   };
  //   fetchData();
  // }, []);

  const createProduct = (data) => {
    console.log({ data });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    unit: Yup.number().min(1).required("Unit is required"),
    description: Yup.string(),
    sku: Yup.string().required("SKU is required"),
    barCode: Yup.string().required("Barcode is required"),
    currentStock: Yup.number().min(0).required("Current stock is required"),
    mainStockLevel: Yup.number()
      .min(0)
      .required("Main stock level is required"),
    purchasedPrice: Yup.number().min(0).required("Purchased price is required"),
    salePrice: Yup.number().min(0).required("Sale price is required"),
    status: Yup.string().required("Status is required"),
    companyId: Yup.string().required("Company is required"),
    categoryId: Yup.string().required("Category is required"),
  });

  return (
    <MainDashboard title="Products">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%", textAlign: "left" }}>
          <NavLink to="/products">
            <Button variant="outlined" sx={{ width: "100px" }}>
              Back
            </Button>
          </NavLink>
        </Grid>
      </Grid>

      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" gutterBottom>
          Create Product
        </Typography>

        <Formik
          initialValues={{
            name: "",
            unit: "",
            description: "",
            sku: "",
            barCode: "",
            currentStock: "",
            mainStockLevel: "",
            purchasedPrice: "",
            salePrice: "",
            status: "active",
            companyId: "",
            categoryId: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await createProduct(values);
              alert("Product created successfully!");
              resetForm();
            } catch (error) {
              alert("Failed to create product");
            }
            setSubmitting(false);
          }}
        >
          {({ handleChange, values, errors, touched, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Product Name"
                    name="name"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Description"
                    name="description"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="SKU"
                    name="sku"
                    error={touched.sku && !!errors.sku}
                    helperText={touched.sku && errors.sku}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Barcode"
                    name="barCode"
                    error={touched.barCode && !!errors.barCode}
                    helperText={touched.barCode && errors.barCode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Current Stock"
                    name="currentStock"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Main Stock Level"
                    name="mainStockLevel"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Purchased Price"
                    name="purchasedPrice"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Sale Price"
                    name="salePrice"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    label="Status"
                    name="status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    label="Company"
                    name="companyId"
                  >
                    {companies.map((company) => (
                      <MenuItem key={company._id} value={company._id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    label="Category"
                    name="categoryId"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 20 }}
                disabled={isSubmitting}
              >
                Create Product
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </MainDashboard>
  );
};

export default CreateProduct;
