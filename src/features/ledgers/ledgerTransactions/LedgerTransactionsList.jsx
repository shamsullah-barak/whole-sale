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

const LedgerTransactionList = () => {
  const dispatch = useDispatch();
  const { ledgerId, subLedgerId } = useParams();

  const ledgerTransactions = useSelector(selectLedgerTransactions);

  useEffect(() => {
    if (subLedgerId) {
      dispatch(
        fetchLedgerTransactionsAsync({
          relatedTo: subLedgerId,
          page: 1,
          limit: ledgerTransactions?.limitPerPage || 20,
        })
      );
    } else if (ledgerId) {
      dispatch(
        fetchLedgerTransactionsAsync({
          relatedTo: ledgerId,
          page: 1,
          limit: ledgerTransactions?.limitPerPage || 20,
        })
      );
    }
  }, [dispatch, subLedgerId]);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(
      fetchLedgerTransactionsAsync({
        subLedgerId: subLedgerId,
        page: page + 1,
        limit: pageSize,
      })
    );
  };

  if (
    ledgerTransactions.loading &&
    ledgerTransactions.ledgerTransactions.length === 0
  ) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Transactions Grid */}
      {ledgerTransactions.ledgerTransactions.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            mt: 2,
          }}
        >
          <ReceiptIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Transactions Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No transactions have been recorded for this sub-ledger yet.
          </Typography>
        </Paper>
      ) : (
        <Datagrid
          rows={ledgerTransactions?.ledgerTransactions}
          columns={columns}
          limitPerPage={ledgerTransactions?.limitPerPage}
          loading={ledgerTransactions?.loading}
          totalRows={ledgerTransactions?.totalRows}
          currentPage={ledgerTransactions?.currentPage}
          stateChanged={stateChanged}
        />
      )}
    </>
  );
};

export default LedgerTransactionList;
