import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Stack,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchLedgerTransactionsAsync } from "../../../store/slices/ledger.transactions.slice";
import { selectLedgerTransactions } from "../../../store/selectors/ledger.transactions.selectors";
import { getSelectedLedger } from "../../../store/selectors/ledgers.selector";
import { selectSelectedSubLedger } from "../../../store/selectors/subLedger.selector";
import Datagrid from "../../../components/DataGrid";
import formatDate from "../../../utils/moment";
import COLORS from "../../../constant/colors";
import LedgerTransactionList from "./LedgerTransactionsList";

const columns = [
  {
    field: "createdAt",
    headerName: "Date",
    flex: 0.5,
    minWidth: 80,
    valueFormatter: (params) => {
      return formatDate(params);
    },
  },
  {
    field: "description",
    headerName: "Account",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "debit",
    headerName: "Debit",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "credit",
    headerName: "Credit",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "balance",
    headerName: "Balance",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const LedgerTransactionsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ledgerId, subLedgerId } = useParams();

  const selectedLedger = useSelector(getSelectedLedger);
  const selectedSubLedger = useSelector(selectSelectedSubLedger);

  const handleBackToSubLedgers = () => {
    navigate(`/ledgers/${ledgerId}`);
  };

  // const breadcrumbs = [
  //   <Link
  //     key="1"
  //     color="inherit"
  //     href="/ledgers"
  //     onClick={(e) => {
  //       e.preventDefault();
  //       navigate("/ledgers");
  //     }}
  //     sx={{ display: "flex", alignItems: "center" }}
  //   >
  //     <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
  //     Ledgers
  //   </Link>,
  //   <Link
  //     key="2"
  //     color="inherit"
  //     href={`/ledgers/${ledgerId}`}
  //     onClick={(e) => {
  //       e.preventDefault();
  //       navigate(`/ledgers/${ledgerId}`);
  //     }}
  //   >
  //     {selectedLedger?.name || "SubLedgers"}
  //   </Link>,
  //   <Typography key="3" color="text.primary">
  //     {selectedSubLedger?.name || "Transactions"}
  //   </Typography>,
  // ];

  return (
    // <Box sx={{ width: "100%" }}>
    //   <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
    //     {breadcrumbs}
    //   </Breadcrumbs>
    //   <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
    //     <Stack
    //       direction="row"
    //       justifyContent="space-between"
    //       alignItems="center"
    //     >
    //       <Stack direction="row" alignItems="center" spacing={2}>
    //         <Button
    //           startIcon={<ArrowBackIcon />}
    //           onClick={handleBackToSubLedgers}
    //           variant="outlined"
    //           size="small"
    //         >
    //           Back to SubLedgers
    //         </Button>
    //         <Box>
    //           <Typography variant="h4" component="h1" gutterBottom>
    //             <ReceiptIcon sx={{ mr: 1, verticalAlign: "middle" }} />
    //             {selectedSubLedger?.name || "Transactions"}
    //           </Typography>
    //           <Typography variant="body1" color="text.secondary">
    //             Transaction history for{" "}
    //             {selectedSubLedger?.name || "this sub-ledger"}
    //           </Typography>
    //         </Box>
    //       </Stack>
    //     </Stack>
    //   </Paper>

    // </Box>

    <>
      <LedgerTransactionList />
    </>
  );
};

const LedgerTransactions = () => {
  return <LedgerTransactionsList />;
};

export default LedgerTransactions;
