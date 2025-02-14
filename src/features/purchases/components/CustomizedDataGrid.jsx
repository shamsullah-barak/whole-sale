import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "../data/gridData";
import { fetchPurchasesAsync, selectPurchases } from "../purchaseSlice";

const CustomizedDataGrid = () => {
  const dispatch = useDispatch();
  const purchases = useSelector(selectPurchases);
  useEffect(() => {
    const loadProducts = () => {
      dispatch(fetchPurchasesAsync({ page: 1, limit: purchases.limitPerPage }));
    };
    loadProducts();
  }, []);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchPurchasesAsync({ page: page + 1, limit: pageSize }));
  };

  return (
    <DataGrid
      rows={purchases?.purchases}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: purchases?.limitPerPage } },
      }}
      pageSizeOptions={[10, 20, 50]}
      onPaginationModelChange={(data) => stateChanged(data)}
      disableColumnResize
      rowCount={purchases.totalRows}
      paginationMode="server"
      pagination
      page={purchases.currentPage}
      pageSize={purchases.limitPerPage}
      loading={purchases.loading}
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
