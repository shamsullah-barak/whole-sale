import axios from "axios";
import React, { useEffect, useState } from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { TextField, MenuItem, Button, Grid2 as Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";

const columns = [
  {
    field: "name",
    headerName: "name",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "province",
    headerName: "province",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "district",
    headerName: "district",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "accountType",
    headerName: "account type",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const JournalList = () => {
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
    <div
      style={{
        height:
          journals?.journals?.length > 0
            ? `${
                Math.min(journals.journals.length, journals.limitPerPage) * 52 +
                56
              }px`
            : "56px", // Just header height when no rows
        width: "100%",
        transition: "height 0.3s ease-in-out", // smooth animation
      }}
    >
      <DataGrid
        rows={journals.journals || []}
        style={{ cursor: "pointer" }}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={handleRowClick}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: journals?.limitPerPage } },
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
    </div>
  );
};

const Journal = () => {
  return (
    <MainDashboard title="Journal">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", textAlign: "right" }}>
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
      <Grid container spacing={2}>
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
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
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
