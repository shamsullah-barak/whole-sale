import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "../data/gridData";
import { fetchAccountsAsync, selectAccounts } from "../accountSlice";

const CustomizedDataGrid = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  useEffect(() => {
    const loadProducts = () => {
      dispatch(fetchAccountsAsync({ page: 1, limit: accounts?.limitPerPage }));
    };
    loadProducts();
  }, []);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchAccountsAsync({ page: page + 1, limit: pageSize }));
  };

  return (
    <DataGrid
      rows={accounts?.accounts}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: accounts?.limitPerPage } },
      }}
      pageSizeOptions={[10, 20, 50]}
      onPaginationModelChange={(data) => stateChanged(data)}
      disableColumnResize
      rowCount={accounts?.totalRows}
      paginationMode="server"
      pagination
      page={accounts?.currentPage}
      pageSize={accounts?.limitPerPage}
      loading={accounts?.loading}
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

export default CustomizedDataGrid;
