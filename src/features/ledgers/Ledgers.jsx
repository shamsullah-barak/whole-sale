import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLedgersAsync,
  setSelectedLedger,
} from "../../store/slices/ledger.slice";
import { selectLedgers } from "../../store/selectors/ledgers.selector";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { selectDirection } from "../../store/selectors/app.selector";
import Datagrid from "../../components/DataGrid";

export const columns = [
  {
    field: "name",
    headerName: "name",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "phone",
    headerName: "Phone",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "address",
    headerName: "Address",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "type",
    headerName: "person type",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const LedgerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ledgers = useSelector(selectLedgers);
  const selectedDirection = useSelector(selectDirection);

  useEffect(() => {
    const loadProducts = () => {
      dispatch(fetchLedgersAsync({ page: 1, limit: ledgers?.limitPerPage }));
    };
    loadProducts();
  }, []);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchLedgersAsync({ page: page + 1, limit: pageSize }));
  };

  const handleRowClick = (params) => {
    dispatch(setSelectedLedger({ ledger: params.row }));
    navigate(`/ledgers/${params.row.id}`);
  };

  return (
    <Datagrid
      rows={ledgers?.ledgers}
      columns={columns}
      limitPerPage={ledgers?.limitPerPage}
      loading={ledgers?.loading}
      totalRows={ledgers?.totalRows}
      currentPage={ledgers?.currentPage}
      stateChanged={stateChanged}
    />
  );
};

const Ledgers = () => {
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();
  return (
    <MainDashboard title="Ledger">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{
            width: "100%",
            textAlign: selectedDirection === "rtl" ? "left" : "right",
          }}
        >
          <NavLink to="/ledgers/create">
            <Button
              variant="contained"
              color="inherit"
              sx={(theme) => ({
                backgroundColor:
                  theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
                color:
                  theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
              })}
            >
              {t("New Ledger")}
            </Button>
          </NavLink>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <LedgerList />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Ledgers;
