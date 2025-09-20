import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../../theme/main/MainDashboard";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedLedger } from "../../../store/selectors/ledgers.selector";
import { fetchLedgerTransactionsAsync } from "../../../store/slices/ledger.transactions.slice";
import { useTranslation } from "react-i18next";
import { selectLedgerTransactions } from "../../../store/selectors/ledger.transactions.selectors";
import Datagrid from "../../../components/DataGrid";
import { useParams } from "react-router-dom";
import formatDate from "../../../utils/moment";

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

  const selectedLedger = useSelector(getSelectedLedger);

  const ledgerTransactions = useSelector(selectLedgerTransactions);

  const { ledgerId } = useParams();

  useEffect(() => {
    const loadLedgerTransactions = () => {
      dispatch(
        fetchLedgerTransactionsAsync({
          ledgerId: ledgerId,
          page: 1,
          limit: ledgerTransactions?.limitPerPage,
        })
      );
    };
    loadLedgerTransactions();
  }, []);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    // dispatch(fetchJournalsAsync({ page: page + 1, limit: pageSize }));
  };

  console.log({ ledgerTransactions });

  return (
    <>
      {ledgerTransactions.ledgerTransactions.length === 0 ? (
        <>
          <div
            style={{
              textAlign: "center",
              marginTop: "50px",
              marginBottom: "50px",
            }}
          >
            {t("No Data found")}
          </div>
        </>
      ) : (
        <>
          <Datagrid
            rows={ledgerTransactions?.ledgerTransactions}
            columns={columns}
            limitPerPage={ledgerTransactions?.limitPerPage}
            loading={ledgerTransactions?.loading}
            totalRows={ledgerTransactions?.totalRows}
            currentPage={ledgerTransactions?.currentPage}
            stateChanged={stateChanged}
          />
        </>
      )}
    </>
  );
};

const LedgerTransactions = () => {
  return (
    <MainDashboard title="Ledger Transactions">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{ width: "100%", textAlign: "right", height: "100%" }}
        >
          <LedgerTransactionsList />
          {/* <LedgerTransactionForm /> */}
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default LedgerTransactions;
