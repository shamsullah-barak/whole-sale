import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Drawer,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchLedgersAsync,
  setSelectedLedger,
} from "../../store/slices/ledger.slice";
import CreateLedgerForm from "./CreateLedgerForm";
import { selectLedgers } from "../../store/selectors/ledgers.selector";
import Datagrid from "../../components/DataGrid";
import COLORS from "../../constant/colors";
import formatDate from "../../utils/moment";
import EntryForm from "../journal/entryForm";

export const columns = [
  {
    field: "name",
    headerName: "Ledger Name",
    flex: 1,
    minWidth: 200,
    align: "left",
  },
  {
    field: "ledgerType",
    headerName: "Ledger Type",
    flex: 1,
    minWidth: 200,
    align: "left",
  },
  {
    field: "currencyType",
    headerName: "Currency",
    flex: 1,
    minWidth: 200,
    align: "left",
  },
  {
    field: "createdAt",
    headerName: "Created Date",
    flex: 0.5,
    minWidth: 150,
    align: "left",
    valueFormatter: (params) => {
      return formatDate(params);
    },
  },
];

const LedgerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ledgers = useSelector(selectLedgers);
  const [formOpen, setFormOpen] = useState(false);
  const [entryDrawerOpen, setEntryDrawerOpen] = useState(false);
  const handleFormClose = () => {
    setFormOpen(false);
  };
  const handleOpenEntryDrawer = () => setEntryDrawerOpen(true);
  const handleCloseEntryDrawer = () => setEntryDrawerOpen(false);

  // useEffect(() => {
  //   const loadLedgers = () => {
  //     dispatch(
  //       fetchLedgersAsync({ page: 1, limit: ledgers?.limitPerPage || 20 })
  //     );
  //   };
  //   loadLedgers();
  // }, [dispatch]);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchLedgersAsync({ page: page + 1, limit: pageSize }));
  };

  const handleRowClick = (params) => {
    dispatch(setSelectedLedger({ ledger: params.row }));
    navigate(`/ledgers/${params.row._id}`);
  };

  const handleCreateLedger = () => {
    setFormOpen(true);
  };

  if (ledgers.loading && ledgers.ledgers.length === 0) {
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
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Paper
        elevation={0} // removes shadow
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid",
          borderColor: "divider", // uses MUI theme divider color
          borderRadius: 2, // optional, for rounded corners
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              <AccountBalanceIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Ledger Accounts
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your chart of accounts and ledger entries
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleOpenEntryDrawer}>
              New Entry
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateLedger}
              sx={{
                backgroundColor: COLORS.PURPLE,
                "&:hover": {
                  backgroundColor: COLORS.PURPLE_DARK,
                },
              }}
            >
              Create Ledger
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Ledgers Grid */}
      {ledgers.ledgers.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <AccountBalanceIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            No Ledgers Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first ledger account to start organizing your finances
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateLedger}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Create Ledger
          </Button>
        </Paper>
      ) : (
        <Datagrid
          rows={ledgers.ledgers}
          columns={columns}
          limitPerPage={ledgers.limitPerPage}
          loading={ledgers.loading}
          totalRows={ledgers.totalRows}
          currentPage={ledgers.currentPage}
          stateChanged={stateChanged}
          onRowClick={(params, event) => handleRowClick(params)}
        />
      )}

      {/* Create Ledger Form Modal */}
      <CreateLedgerForm open={formOpen} onClose={handleFormClose} />

      {/* Journal Entry Drawer */}
      <Drawer
        anchor="right"
        open={entryDrawerOpen}
        onClose={handleCloseEntryDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 520, md: 640 },
            maxWidth: "100%",
            // Ensure drawer overlays header/app bar
            zIndex: (theme) => theme.zIndex.drawer + 3,
          },
          // Also raise the modal container z-index just in case
          zIndex: (theme) => theme.zIndex.drawer + 3,
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            aria-label="close drawer"
            onClick={handleCloseEntryDrawer}
            size="small"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">New Journal Entry</Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <EntryForm />
        </Box>
      </Drawer>
    </Box>
  );
};

const Ledgers = () => {
  return <LedgerList />;
};

export default Ledgers;
