import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLedgersAsync,
  setSelectedLedger,
} from "../../store/slices/ledger.slice";
import { selectLedgers } from "../../store/selectors/ledgers.selector";
import Datagrid from "../../components/DataGrid";

export const columns = [
  {
    field: "name",
    headerName: "name",
    flex: 0.5,
    minWidth: 80,
    align: "center",
  },
];

const LedgerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ledgers = useSelector(selectLedgers);

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
    navigate(`/ledgers/${params.row._id}`);
  };

  return (
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
  );
};

const Ledgers = () => {
  return (
    <MainDashboard title="Ledger">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <LedgerList />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Ledgers;
