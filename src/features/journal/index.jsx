import axios from "axios";
import React, { useEffect, useState } from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import {
  TextField,
  MenuItem,
  Button,
  Grid2 as Grid,
  Autocomplete,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";
import { useTranslation } from "react-i18next";
import { selectLedgers } from "../../store/selectors/ledgers.selector";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { selectProducts } from "../../store/selectors/product.selector";
import { ToastContainer, toast } from "react-toastify";
import { selectTransactionTypes } from "../../store/selectors/transaction.types.selector";

const columns = [
  {
    field: "status",
    headerName: "status",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "amount",
    headerName: "amount",
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

const JournalList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const journals = useSelector(selectJournals);

  useEffect(() => {
    const loadProducts = () => {
      // dispatch(fetchAccountsAsync({ page: 1, limit: journals?.limitPerPage }));
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
    };
    loadProducts();
  }, []);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchJournalsAsync({ page: page + 1, limit: pageSize }));
  };

  const handleRowClick = (params) => {
    // dispatch(setSelectedAccount({ account: params.row }));
    // navigate(`/ledgers/${params.row.id}`);
  };

  return (
    <>
      {journals.journals.length === 0 ? (
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
            rows={journals.journals || []}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: journals?.limitPerPage },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(data) => stateChanged(data)}
            disableColumnResize
            rowCount={journals?.totalRows}
            paginationMode="server"
            pagination
            page={journals?.currentPage}
            pageSize={journals?.limitPerPage}
            loading={journals?.loading}
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

const Journal = () => {
  const { t } = useTranslation();

  return (
    <MainDashboard title={t("Journal")}>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", height: "100%" }}>
          <JournalList />
          <JournalForm />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

const MoneyDeposit = ({ statusId }) => {
  const { t } = useTranslation();
  const journals = useSelector(selectJournals);
  const transactionTypes = useSelector(selectTransactionTypes);
  const products = useSelector(selectProducts).products;
  const ledgers = useSelector(selectLedgers);
  const selectedDirection = useSelector(selectDirection);

  const dispatch = useDispatch();

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);
    try {
      await axios.post(
        `http://localhost:5000/api/journalEntries?statusId=${statusId}`,
        journalEntry,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
      setJournalEntry({
        description: "",
        amount: 0,
      });
    } catch (error) {
      console.log({ error });
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  const [journalEntry, setJournalEntry] = useState({
    description: "",
    amount: 0,
    ledgerId: "",
    ledgerInfo: "",
  });

  return (
    <>
      <form style={{ marginTop: "15px" }}>
        <Grid container>
          <Grid xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label={t("select ledger")}
              style={{ minWidth: "200px" }}
              dir={selectedDirection === "rtl" ? "right" : "left"}
              value={journalEntry.ledgerId}
              onChange={(event) => {
                const selectedLedger = ledgers.ledgers.find(
                  (ledger) => ledger.id === event.target.value
                );
                setJournalEntry({
                  ...journalEntry,
                  ledgerId: selectedLedger.id,
                  ledgerInfo: selectedLedger.name,
                });
              }}
            >
              {ledgers.ledgers?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.ledgerType} د {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("Quantity")}
              name="amount"
              type="number"
              value={journalEntry.amount}
              onChange={(event) =>
                setJournalEntry({
                  ...journalEntry,
                  amount: event.target.value,
                })
              }
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("description")}
              name="description"
              type="text"
              value={journalEntry.description}
              onChange={(event) =>
                setJournalEntry({
                  ...journalEntry,
                  description: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="inherit"
          style={{ marginTop: 20 }}
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
            color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
          })}
          onClick={journalEntryHandler}
        >
          {t("Add")}
        </Button>
      </form>
    </>
  );
};

// unit types for purchase component
const unitTypes = ["kg", "piece", "carton", "liter", "dozen"];
const PurchaseOfGoods = ({ statusId }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState({ statusId: "", statusName: "" });
  const journals = useSelector(selectJournals);
  const transactionTypes = useSelector(selectTransactionTypes);
  const products = useSelector(selectProducts).products;
  const ledgers = useSelector(selectLedgers);
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();

  const [journalEntry, setJournalEntry] = useState({});

  const journalEntryHandler = () => {};

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12} sm={12}>
          <Autocomplete
            disablePortal
            disableClearable
            options={products}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label={t("Products")} variant="outlined" />
            )}
            onChange={(event, value) => {
              if (value) {
                setJournalEntry({ ...journalEntry, productId: value.id });
              }
            }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("expiryDate")}
            name="expiryDate"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={journalEntry.expiryDate}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                expiryDate: event.target.value,
              })
            }
            sx={{ height: "100%", width: "100%" }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("Quantity")}
            name="amount"
            type="number"
            value={journalEntry.amount}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                amount: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t("unitType")}
            style={{ minWidth: "200px" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.unitType}
            onChange={(event) => {
              console.log(event.target.value);
            }}
          >
            {unitTypes.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("unitPerPackage")}
            name="unitPerPackage"
            type="number"
            value={journalEntry.unitPerPackage}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                unitPerPackage: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("unitPrice")}
            name="unitPrice"
            type="number"
            value={journalEntry.unitPrice}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                unitPrice: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("totalPrice")}
            name="totalPrice"
            type="number"
            value={journalEntry.totalPrice}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                totalPrice: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("paymentMethod")}
            name="paymentMethod"
            type="text"
            value={journalEntry.paymentMethod}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                paymentMethod: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("invoiceNo")}
            name="invoiceNo"
            type="number"
            value={journalEntry.invoiceNo}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                invoiceNo: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("storageLocation")}
            name="stockId"
            type="number"
            value={journalEntry.stockId}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                stockId: event.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        color="inherit"
        style={{ marginTop: 20 }}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
          color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
        })}
        onClick={journalEntryHandler}
      >
        {t("Add")}
      </Button>
    </>
  );
};

const JournalForm = () => {
  const [status, setStatus] = useState({ statusId: "", statusName: "" });
  const transactionTypes = useSelector(selectTransactionTypes);
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();

  return (
    <>
      <ToastContainer />
      <Grid xs={12} sm={12} marginTop={"15px"} padding={"3px"}>
        <TextField
          select
          fullWidth
          label={t("Status")}
          name="status"
          value={status.statusId || ""} // default empty string if null
          onChange={(event) => {
            const selectedId = event.target.value;
            const selectedType = transactionTypes.find(
              (item) => item.id === selectedId
            );
            setStatus({
              statusName: selectedType.engName,
              statusId: selectedId,
            });
          }}
          style={{ minWidth: "200px" }}
        >
          {transactionTypes.map((item) => (
            <MenuItem key={item.id} value={item.id} dir={selectedDirection}>
              {t(`${item.engName}`)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* money deposit */}
      {status.statusName === "Money Deposit" && (
        <MoneyDeposit statusId={status.statusId} />
      )}

      {/* purchasing something */}
      {status.statusName === "Purchase of goods" && (
        <PurchaseOfGoods statusId={status.statusId} />
      )}
    </>
  );
};

export default Journal;
