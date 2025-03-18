import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "../data/gridData";
import { useNavigate } from "react-router-dom";
import { fetchAccountsAsync } from "../../../store/slices/account.slice";
import { selectAccounts } from "../../../store/selectors/account.selector";

const CustomizedDataGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleRowClick = (params) => {
    console.log({ params: params.row });
    dispatch(setSelectedAccount(params.row));
  };

  return (
    <DataGrid
      rows={accounts?.accounts}
      columns={columns}
      getRowId={(row) => row.id}
      onRowClick={handleRowClick}
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
