import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLedgersAsync,
  setSelectedLedger,
} from "../../store/slices/ledger.slice";
import { selectLedgers } from "../../store/selectors/ledgers.selector";

export const columns = [
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
  {
    field: "phoneNumber",
    headerName: "phone number",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "whatsAppNumber",
    headerName: "whatsApp",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const CustomizedDataGrid = () => {
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
    dispatch(setSelectedLedger({ account: params.row }));
    navigate(`/ledgers/${params.row.id}`);
  };

  return (
    <DataGrid
      rows={ledgers?.ledgers}
      style={{ cursor: "pointer" }}
      columns={columns}
      getRowId={(row) => row.id}
      onRowClick={handleRowClick}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: ledgers?.limitPerPage } },
      }}
      pageSizeOptions={[10, 20, 50]}
      onPaginationModelChange={(data) => stateChanged(data)}
      disableColumnResize
      rowCount={ledgers?.totalRows}
      paginationMode="server"
      pagination
      page={ledgers?.currentPage}
      pageSize={ledgers?.limitPerPage}
      loading={ledgers?.loading}
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
  );
};

const Ledgers = () => {
  return (
    <MainDashboard title="Ledgers">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%", textAlign: "right" }}>
          <NavLink to="/ledgers/create">
            <Button variant="outlined">New Ledger</Button>
          </NavLink>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%" }}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Ledgers;
