import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import axios from "axios";

const PurchaseForm = () => {
  const createPurchaseHandler = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/purchases",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    note: Yup.string().required("Product name is required"),
    purchasedPrice: Yup.number().min(1).required("Price is required"),
    quantity: Yup.string().required("Quantity is required"),
    purchasedPrice: Yup.number()
      .min(0)
      .required("Purchased purchasedPrice is required"),
    status: Yup.string().required("Status is required"),
  });

  return (
    <Formik
      initialValues={{
        note: "",
        quantity: "0",
        purchasedPrice: "0",
        totalPrice: "0",
        salePrice: "0",
        status: "paid",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await createPurchaseHandler(values);
        resetForm();
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
                label="Name | Note | Description"
                name="note"
                error={touched.note && !!errors.note}
                helperText={touched.note && errors.note}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                as={TextField}
                fullWidth
                label="Purchase Price"
                name="purchasedPrice"
                type="number"
                error={touched.purchasedPrice && !!errors.purchasedPrice}
                helperText={touched.purchasedPrice && errors.purchasedPrice}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                as={TextField}
                fullWidth
                label="Quantity"
                name="quantity"
                error={touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field
                as={TextField}
                fullWidth
                label="Total Price"
                name="totalPrice"
                type="number"
                value={values.quantity * values.purchasedPrice}
                disabled={true}
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
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Field>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field
                as={TextField}
                fullWidth
                label="Company Name"
                name="companyName"
                error={touched.companyName && !!errors.companyName}
                helperText={touched.companyName && errors.companyName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                as={TextField}
                fullWidth
                label="Category "
                name="category"
                error={touched.category && !!errors.category}
                helperText={touched.category && errors.category}
              />
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
            Create Purchase
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default PurchaseForm;
