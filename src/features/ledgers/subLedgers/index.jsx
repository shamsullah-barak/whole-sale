import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchSubLedgersAsync } from "../../../store/slices/subLedger.slice";
import {
  selectSubLedgers,
  selectSubLedgerLoading,
  selectSubLedgerError,
} from "../../../store/selectors/subLedger.selector";
import { getSelectedLedger } from "../../../store/selectors/ledgers.selector";
import SubLedgerItem from "./SubLedgerItem";
import SubLedgerForm from "./SubLedgerForm";
import COLORS from "../../../constant/colors";
import LedgerTransactions from "../ledgerTransactions";

const SubLedgerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ledgerId } = useParams();
  const { t } = useTranslation();

  const subLedgers = useSelector(selectSubLedgers);
  const loading = useSelector(selectSubLedgerLoading);
  const error = useSelector(selectSubLedgerError);
  const selectedLedger = useSelector(getSelectedLedger);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubLedger, setEditingSubLedger] = useState(null);

  useEffect(() => {
    if (ledgerId) {
      dispatch(fetchSubLedgersAsync({ ledgerId, page: 1, limit: 20 }));
    }
  }, [dispatch, ledgerId]);

  const handleCreateSubLedger = () => {
    setEditingSubLedger(null);
    setFormOpen(true);
  };

  const handleEditSubLedger = (subLedger) => {
    setEditingSubLedger(subLedger);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingSubLedger(null);
  };

  const handleBackToLedgers = () => {
    navigate("/ledgers");
  };

  const breadcrumbs = [
    <Link
      key="1"
      color="inherit"
      href="/ledgers"
      onClick={(e) => {
        e.preventDefault();
        navigate("/ledgers");
      }}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
      Ledgers
    </Link>,
    <Typography key="2" color="text.primary">
      {selectedLedger?.name || "SubLedgers"}
    </Typography>,
  ];

  if (loading && subLedgers.subLedgers.length === 0) {
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
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        {breadcrumbs}
      </Breadcrumbs>

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
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToLedgers}
              variant="outlined"
              size="small"
            >
              Back to Ledgers
            </Button>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                <AccountBalanceIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                {selectedLedger?.name || "SubLedgers"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage sub-ledgers for this ledger account
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateSubLedger}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Create SubLedger
          </Button>
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* SubLedgers Grid */}
      {/* {subLedgers.subLedgers.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <AccountBalanceIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            No SubLedgers Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first sub-ledger to start organizing transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateSubLedger}
            sx={{
              backgroundColor: COLORS.PURPLE,
              "&:hover": {
                backgroundColor: COLORS.PURPLE_DARK,
              },
            }}
          >
            Create SubLedger
          </Button>
        </Paper>
      ) : ( */}
      <Grid container spacing={3}>
        {subLedgers.subLedgers.map((subLedger) => (
          <Grid item xs={12} sm={6} md={4} key={subLedger._id}>
            <SubLedgerItem subLedger={subLedger} onEdit={handleEditSubLedger} />
          </Grid>
        ))}
      </Grid>
      {/* )} */}

      <LedgerTransactions />

      {/* SubLedger Form Modal */}
      <SubLedgerForm
        open={formOpen}
        onClose={handleFormClose}
        subLedger={editingSubLedger}
        isEdit={!!editingSubLedger}
      />
    </Box>
  );
};

export default SubLedgerList;
