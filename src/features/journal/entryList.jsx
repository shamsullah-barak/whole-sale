import React, { useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { IconButton, Box, TextField, MenuItem, Button } from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import formatDate from "../../utils/moment";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectJournals } from "../../store/selectors/journal.selector";
import {
  addItemToJournals,
  fetchJournalsAsync,
} from "../../store/slices/journal.slice";
import { useEffect } from "react";
import { selectDirection } from "../../store/selectors/app.selector";
import CheckIcon from "@mui/icons-material/Check";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectLedgers } from "../../store/selectors/ledgers.selector";

function CustomToolbar() {
  const [showQuick, setShowQuick] = useState(false);

  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1,

        bgcolor: "background.paper",
      }}
    >
      <div />

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {showQuick && (
          <Box sx={{ width: 200 }}>
            <GridToolbarQuickFilter debounceMs={300} placeholder="Search..." />
          </Box>
        )}

        <IconButton
          size="small"
          onClick={() => setShowQuick((s) => !s)}
          aria-label="search"
          sx={{ bgcolor: "transparent", p: 0.5 }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>

        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarExport csvOptions={{ fileName: "ledger-export" }} />
      </Box>
    </GridToolbarContainer>
  );
}

function CustomFooter() {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const ledgers = useSelector(selectLedgers).ledgers;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    relatedTo: "",
    debit: 0,
    credit: 0,
    description: "",
  });

  // input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // submit handler
  const handleSubmit = async (event) => {
    event.preventDefault(event);

    try {
      setLoading(true);
      const result = await axios.post(
        `http://localhost:5000/api/journal-entries`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      toast.success("data updated");
      console.log({ result });
      dispatch(addItemToJournals({ item: result.data[0] }));
    } catch (error) {
      console.log(error);
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 1,
          p: 1,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          required
          name="relatedTo"
          label={t("ledger")}
          value={formData.relatedTo}
          onChange={(event) => {
            setFormData({ ...formData, relatedTo: event.target.value });
          }}
        >
          {ledgers.map((item, index) => (
            <MenuItem key={index} value={item._id}>
              {t(`${item.name}`)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Debit"
          name="debit"
          type="number"
          value={formData.debit}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Credit"
          name="credit"
          type="number"
          value={formData.credit}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Button
          color="primary"
          onClick={handleSubmit}
          sx={{
            width: "100%",
          }}
          variant="outlined"
          startIcon={<CheckIcon />}
          loading={loading}
        >
          save
        </Button>
      </Box>
    </>
  );
}

export default function LedgerGrid() {
  const selectedDirection = useSelector(selectDirection);

  const handleDelete = (id) => {};

  const dispatch = useDispatch();
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
      field: "ledger.name",
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
      field: "description",
      headerName: "Description",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" color="primary" aria-label="edit">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            aria-label="delete"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const onRowClick = () => {};

  return (
    <>
      <DataGrid
        slots={{
          toolbar: CustomToolbar,
          footer: () => <CustomFooter />,
        }}
        rows={journals?.journals}
        style={{
          cursor: "pointer",
          textAlign: selectedDirection === "rtl" ? "left" : "right",
        }}
        columns={columns}
        getRowId={(row) => row._id}
        // onRowClick={handleRowClick}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "odd-row" : "even-row"
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
        onRowClick={onRowClick}
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
  );
}
