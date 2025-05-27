import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../../theme/main/MainDashboard";
import LedgerTransactionForm from "./ledgerTransactionForm";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedLedger } from "../../../store/selectors/ledgers.selector";
import { useNavigate } from "react-router-dom";
import { fetchLedgerTransactionsAsync } from "../../../store/slices/ledger.transactions.slice";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { selectLedgerTransactions } from "../../../store/selectors/ledger.transactions.selectors";

const columns = [
  {
    field: "amount",
    headerName: "amount",
    headerAlign: "center",
    align: "center",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "type",
    headerName: "type",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "description",
    headerName: "description",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "date",
    headerName: "date",
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

  const selectedLedger = useSelector(getSelectedLedger);

  const ledgerTransactions = useSelector(selectLedgerTransactions);

  console.log({ ledgerTransactions, selectedLedger });

  useEffect(() => {
    const loadLedgerTransactions = () => {
      dispatch(
        fetchLedgerTransactionsAsync({
          ledgerId: selectedLedger.id,
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

  const handleRowClick = (params) => {
    // dispatch(setSelectedAccount({ account: params.row }));
    // navigate(`/ledgers/${params.row.id}`);
  };

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
          <DataGrid
            rows={ledgerTransactions.ledgerTransactions || []}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: ledgerTransactions?.limitPerPage },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(data) => stateChanged(data)}
            disableColumnResize
            rowCount={ledgerTransactions?.totalRows}
            paginationMode="server"
            pagination
            page={ledgerTransactions?.currentPage}
            pageSize={ledgerTransactions?.limitPerPage}
            loading={ledgerTransactions?.loading}
            density="compact"
            slotProps={{
              filterPanel: {
                filterFormProps: {
                  logicOperatorInputProps: {
                    variant: "outlined",
                    size: "small",
                  },
                  columnInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  operatorInputProps: {
                    variant: "outlined",
                    size: "small",
                    sx: { mt: "auto" },
                  },
                  valueInputProps: {
                    InputComponentProps: {
                      variant: "outlined",
                      size: "small",
                    },
                  },
                },
              },
            }}
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
        <Grid item xs={12} lg={9} sx={{ width: "100%", textAlign: "right" }}>
          <LedgerTransactionsList />
          <LedgerTransactionForm />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default LedgerTransactions;
