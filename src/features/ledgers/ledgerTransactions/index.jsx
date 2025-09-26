import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedLedger } from "../../../store/selectors/ledgers.selector";
import { fetchLedgerTransactionsAsync } from "../../../store/slices/ledger.transactions.slice";
import { useTranslation } from "react-i18next";
import { selectLedgerTransactions } from "../../../store/selectors/ledger.transactions.selectors";
import Datagrid from "../../../components/DataGrid";
import { useParams } from "react-router-dom";
import formatDate from "../../../utils/moment";
import COLORS from "../../../constant/colors";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { selectDirection } from "../../../store/selectors/app.selector";
import Model from "../../../components/Model";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

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

const CreateSubLedger = ({ open, setOpen }) => {
  // const { t } = useTranslation();
  // const dispatch = useDispatch();

  const { ledgerId } = useParams();

  //   states
  const [loading, setLoading] = useState(false);
  const [subLedgerName, setSubLedgerName] = useState("");

  // methods
  const handleClose = () => {
    setOpen(false);
    setSubLedgerName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:5000/api/sub-ledgers`,
        { name: subLedgerName, ledgerId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOpen(false);
      setLoading(false);
      toast.success("data added");
      // dispatch(fetchSuppliersAsync({ page: 1, limit: 10 }));
    } catch (error) {
      setOpen(false);
      setLoading(false);
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Model
        open={open}
        handleClose={handleClose}
        submit="submit"
        cancel="cancel"
        loading={loading}
        disabled={loading}
        handleSubmit={handleSubmit}
      >
        <Typography variant="h6" mb={2}>
          Add Sub Ledger
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="subLedgerName"
            name="subLedgerName"
            value={subLedgerName}
            onChange={(event) => setSubLedgerName(event.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
      </Model>
    </>
  );
};

const SubLedger = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selectedDirection = useSelector(selectDirection);

  return (
    <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
      <Grid
        xs={12}
        lg={9}
        sx={{
          width: "100%",
          textAlign: selectedDirection === "rtl" ? "left" : "right",
        }}
      >
        <CreateSubLedger open={open} setOpen={setOpen} />
        <Button
          variant="contained"
          color="inherit"
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
            color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
          })}
          onClick={() => setOpen(true)}
        >
          {t("New Sub Ledger")}
        </Button>
      </Grid>
    </Grid>
  );
};

const LedgerTransactions = () => {
  return (
    <>
      <SubLedger />
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{ width: "100%", textAlign: "right", height: "100%" }}
        >
          <LedgerTransactionsList />
        </Grid>
      </Grid>
    </>
  );
};

export default LedgerTransactions;
