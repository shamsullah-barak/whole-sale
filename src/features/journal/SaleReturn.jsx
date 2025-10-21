// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Button,
//   Divider,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import { Grid2 as Grid } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import { InputAdornment, CircularProgress } from "@mui/material";
// import { toast, ToastContainer } from "react-toastify";
// import { useSelector } from "react-redux";
// import { selectDirection } from "../../store/selectors/app.selector";
// import COLORS from "../../constant/colors";

// const TOTAL_RETURN = "TOTAL_RETURN";

// const SaleReturn = () => {
//   const { t } = useTranslation();
//   const [unitTypes, setUnitTypes] = useState([]);
//   const [sale, setSale] = useState(null);
//   const [query, setQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [saleReturn, setSaleReturn] = useState({
//     quantity: "",
//     unitType: "",
//     returnReason: "",
//     totalReturn: false,
//   });

//   const selectedDirection = useSelector(selectDirection);

//   const clearState = () => {
//     setUnitTypes([]);
//     setSale(null);
//     setDebouncedQuery("");
//     setQuery("");
//     setSaleReturn({
//       quantity: "",
//       unitType: "",
//       returnReason: "",
//       totalReturn: false,
//     });
//   };
//   // Debounce input
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setDebouncedQuery(query);
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [query]);

//   // API call
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!debouncedQuery) return;

//       setLoading(true);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/sales?saleCounter=${debouncedQuery}`
//         );
//         if (res.data.results[0]) {
//           setSale({ ...res.data.results[0] });
//           setUnitTypes(["piece", res?.data?.results[0]?.unitType]);
//         } else {
//           toast.info("sale not found");
//           setSale(null);
//           setUnitTypes([]);
//         }
//       } catch (error) {
//         toast.error(
//           error?.response?.data?.message ??
//             "something went wrong! please try again"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [debouncedQuery]);

//   const handleChange = (event) => {
//     const { name, value, checked } = event.target;

//     if (name === TOTAL_RETURN) {
//       setSaleReturn({
//         ...saleReturn,
//         totalReturn: checked,
//         unitType: sale.unitType,
//         quantity: sale.quantity,
//       });
//     } else {
//       setSaleReturn({
//         ...saleReturn,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     const data = {
//       returnReason: saleReturn.returnReason,
//       saleId: sale._id,
//       returnQuantity: saleReturn.totalReturn
//         ? sale.quantity
//         : saleReturn.quantity,
//       returnQuantityType: saleReturn.unitType
//         ? saleReturn.unitType
//         : sale.unitType,
//     };

//     try {
//       await axios.post("http://localhost:5000/api/sale-return", data, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       clearState();

//       toast.success("data added");
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ??
//           "something went wrong! please try again"
//       );
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <Box
//         sx={{
//           mx: "auto",
//           mt: 3,
//           p: 3,
//         }}
//       >
//         <FormControl fullWidth margin="normal">
//           <Grid xs={12} sm={6}>
//             <TextField
//               label="Search"
//               variant="outlined"
//               fullWidth
//               type="number"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     {loading && <CircularProgress size={20} />}
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//         </FormControl>

//         {sale && (
//           <>
//             <Divider style={{ marginTop: "12px", marginBottom: "12px" }} />
//             <Grid container spacing={2} sx={{ marginTop: "15px" }}>
//               <Grid size={4} xs={12} sm={12}>
//                 <Typography>{t(`productName`)}</Typography>
//               </Grid>
//               <Grid size={4} xs={12} sm={12}>
//                 <Typography>{t(`sold quantity`)}</Typography>
//               </Grid>{" "}
//               <Grid size={4} xs={12} sm={12}>
//                 <Typography>{t(`returnQty`)}</Typography>
//               </Grid>
//             </Grid>
//             <Grid container spacing={2} sx={{ marginTop: "15px" }}>
//               <Grid size={4} xs={12} sm={12}>
//                 <Typography>{sale.productName}</Typography>
//               </Grid>
//               <Grid size={4} xs={12} sm={12}>
//                 <Typography>
//                   {sale.quantity} {sale.unitType}
//                 </Typography>
//               </Grid>{" "}
//               <Grid size={4} xs={12} sm={12}>
//                 <Typography>0</Typography>
//               </Grid>
//             </Grid>
//             <Divider style={{ marginTop: "20px", marginBottom: "30px" }} />

//             <Grid container spacing={2} sx={{ marginTop: "15px" }}>
//               <Grid size={4} xs={12} sm={12}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       name={TOTAL_RETURN}
//                       checked={saleReturn.totalReturn}
//                       onChange={handleChange}
//                     />
//                   }
//                   label="Total Return"
//                 />
//               </Grid>
//               <Grid size={4} xs={12} sm={12}>
//                 <TextField
//                   select
//                   fullWidth
//                   required
//                   name="unitType"
//                   label={t("unitType")}
//                   style={{ minWidth: "200px" }}
//                   type="text"
//                   disabled={saleReturn.totalReturn}
//                   dir={selectedDirection === "rtl" ? "right" : "left"}
//                   value={saleReturn.unitType}
//                   onChange={handleChange}
//                 >
//                   {unitTypes.map((item, index) => (
//                     <MenuItem key={index} value={item}>
//                       {t(`${item}`)}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               <Grid size={4} xs={12} sm={12}>
//                 <TextField
//                   variant="outlined"
//                   fullWidth
//                   label="Select Return Quantity"
//                   type="number"
//                   name="quantity"
//                   disabled={saleReturn.totalReturn}
//                   value={saleReturn.quantity}
//                   onChange={handleChange}
//                 />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2} sx={{ marginTop: "15px" }}>
//               <Grid size={12} xs={12} sm={12}>
//                 <TextField
//                   fullWidth
//                   label={t("returnReason")}
//                   name="returnReason"
//                   type="text"
//                   value={saleReturn.returnReason}
//                   onChange={(event) =>
//                     setSaleReturn({
//                       ...saleReturn,
//                       returnReason: event.target.value,
//                     })
//                   }
//                 />
//               </Grid>
//             </Grid>
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               color="inherit"
//               style={{ marginTop: 20 }}
//               sx={(theme) => ({
//                 backgroundColor:
//                   theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
//                 color:
//                   theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
//               })}
//               onClick={handleSubmit}
//             >
//               {t("Add")}
//             </Button>
//           </>
//         )}
//       </Box>
//     </>
//   );
// };

// export default SaleReturn;

const Something = () => {
  return <></>;
};
export default Something;
