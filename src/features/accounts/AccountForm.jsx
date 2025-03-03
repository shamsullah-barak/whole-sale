// import React from "react";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { TextField, MenuItem, Button, Grid } from "@mui/material";
// import axios from "axios";

// const PurchaseForm = () => {
//   const createPurchaseHandler = async (data) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/purchases",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const validationSchema = Yup.object().shape({
//     note: Yup.string().required("Product name is required"),
//     purchasedPrice: Yup.number().min(1).required("Price is required"),
//     quantity: Yup.string().required("Quantity is required"),
//     purchasedPrice: Yup.number()
//       .min(0)
//       .required("Purchased purchasedPrice is required"),
//     totalPrice: Yup.number()
//       .min(0)
//       .required("Purchased purchasedPrice is required"),
//     status: Yup.string().required("Status is required"),
//   });

//   return (
//     <Formik
//       initialValues={{
//         note: "",
//         quantity: "0",
//         purchasedPrice: "0",
//         totalPrice: "0",
//         salePrice: "0",
//         status: "paid",
//       }}
//       validationSchema={validationSchema}
//       onSubmit={async (values, { setSubmitting, resetForm }) => {
//         await createPurchaseHandler(values);
//         resetForm();
//         setSubmitting(false);
//       }}
//     >
//       {({ handleChange, values, errors, touched, isSubmitting }) => (
//         <Form>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 label="Name | Note | Description"
//                 name="note"
//                 error={touched.note && !!errors.note}
//                 helperText={touched.note && errors.note}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 label="Purchase Price"
//                 name="purchasedPrice"
//                 type="number"
//                 error={touched.purchasedPrice && !!errors.purchasedPrice}
//                 helperText={touched.purchasedPrice && errors.purchasedPrice}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 label="Quantity"
//                 name="quantity"
//                 type="number"
//                 error={touched.quantity && !!errors.quantity}
//                 helperText={touched.quantity && errors.quantity}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 label="Total Price"
//                 name="totalPrice"
//                 type="number"
//                 value={values.quantity * values.purchasedPrice}
//                 disabled={true}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 label="Sale Price"
//                 name="salePrice"
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 select
//                 fullWidth
//                 label="Status"
//                 name="status"
//               >
//                 <MenuItem value="paid">Paid</MenuItem>
//                 <MenuItem value="partial">Partial</MenuItem>
//                 <MenuItem value="pending">Pending</MenuItem>
//               </Field>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 label="Company Name"
//                 name="companyName"
//                 error={touched.companyName && !!errors.companyName}
//                 helperText={touched.companyName && errors.companyName}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Field
//                 as={TextField}
//                 fullWidth
//                 label="Category "
//                 name="category"
//                 error={touched.category && !!errors.category}
//                 helperText={touched.category && errors.category}
//               />
//             </Grid>
//           </Grid>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             style={{ marginTop: 20 }}
//             disabled={isSubmitting}
//           >
//             Create Purchase
//           </Button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default PurchaseForm;

import React, { useState } from "react";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import axios from "axios";

const PurchaseForm = () => {
  const [purchase, setPurchase] = useState({
    note: "",
    purchasedPrice: 0,
    totalPrice: 0,
    salePrice: 0,
    status: "paid",
    companyName: "",
    category: "",
    quantity: 0,
  });

  // purchase handler
  const createPurchaseHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/purchases",
        purchase,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPurchase({
        note: "",
        purchasedPrice: 0,
        totalPrice: 0,
        salePrice: 0,
        status: "paid",
        companyName: "",
        category: "",
        quantity: 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name | Note | Description"
            name="note"
            value={purchase.note}
            onChange={(event) =>
              setPurchase({ ...purchase, note: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Purchase Price"
            name="purchasedPrice"
            type="number"
            value={purchase.purchasedPrice}
            onChange={(event) =>
              setPurchase({
                ...purchase,
                purchasedPrice: event.target.value,
                totalPrice: purchase.quantity * event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={purchase.quantity}
            onChange={(event) =>
              setPurchase({
                ...purchase,
                quantity: event.target.value,
                totalPrice: purchase.purchasedPrice * event.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Price"
            name="totalPrice"
            type="number"
            value={purchase.quantity * purchase.purchasedPrice}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sale Price"
            name="salePrice"
            type="number"
            value={purchase.salePrice}
            onChange={(event) =>
              setPurchase({ ...purchase, salePrice: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={purchase.status}
            onChange={(event) =>
              setPurchase({ ...purchase, status: event.target.value })
            }
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={purchase.companyName}
            onChange={(event) =>
              setPurchase({ ...purchase, companyName: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category "
            name="category"
            value={purchase.category}
            onChange={(event) =>
              setPurchase({ ...purchase, category: event.target.value })
            }
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 20 }}
        onClick={createPurchaseHandler}
      >
        Create Purchase
      </Button>
    </form>
  );
};

export default PurchaseForm;
