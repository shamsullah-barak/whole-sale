import axios from "axios";
import React, { useEffect, useState } from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { TextField, MenuItem, Button, Grid2 as Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";
import { useTranslation } from "react-i18next";
import { selectLedgers } from "../../store/selectors/ledgers.selector";

const columns = [
  {
    field: "status",
    headerName: "status",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "quantity",
    headerName: "quantity",
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

  console.log({ journals });

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

const financialTerms = [
  "Money deposit",
  "Money withdrawal",
  "Issuing a remittance",
  "Receiving a remittance",
  "Purchase of goods",
  "Purchase return",
  "Sale of goods",
  "Sales return",
  "Settlement of balance",
  "Settlement of receivables",
];

const JournalForm = () => {
  const dispatch = useDispatch();
  const journals = useSelector(selectJournals);
  const ledgers = useSelector(selectLedgers);
  const { t } = useTranslation();

  const [journalEntry, setJournalEntry] = useState({
    description: "",
    quantity: 0,
    status: "",
  });

  // journalEntry handler
  const createPurchaseHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/journalEntries",
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
        quantity: 0,
        status: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form>
      <Grid container>
        <Grid xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={journalEntry.status}
            onChange={(event) =>
              setJournalEntry({ ...journalEntry, status: event.target.value })
            }
            style={{ minWidth: "200px" }}
          >
            {financialTerms.map((item, index) => (
              <MenuItem key={index} value={item}>
                {t(`${item}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {journalEntry.status === "Money deposit" && (
          <>
            <Grid xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="select ledger"
                style={{ minWidth: "200px" }}
              >
                {ledgers.ledgers?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item.ledgerType} د {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </>
        )}

        {/* {journalEntry.status === "Purchase of goods" && (
          <>
            <Grid xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="select product"
                name="productId"
                value={journalEntry.productId}
                onChange={(event) =>
                  setJournalEntry({
                    ...journalEntry,
                    productId: event.target.value,
                  })
                }
                style={{ minWidth: "200px" }}
              >
                {financialTerms.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </>
        )} */}

        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={journalEntry.quantity}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                quantity: event.target.value,
              })
            }
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            fullWidth
            label="Description"
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
        color="primary"
        fullWidth
        style={{ marginTop: 20 }}
        onClick={createPurchaseHandler}
      >
        Create Journal Entry
      </Button>
    </form>
  );
};

export default Journal;
