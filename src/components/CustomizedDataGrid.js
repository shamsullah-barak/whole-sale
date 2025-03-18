import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "../internals/data/gridData";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAsync } from "../store/slices/product.slice";
import { selectProducts } from "../store/selectors/product.selector";

const CustomizedDataGrid = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  useEffect(() => {
    const loadProducts = () => {
      dispatch(fetchProductsAsync({ page: 1, limit: products.limitPerPage }));
    };
    loadProducts();
  }, []);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchProductsAsync({ page: page + 1, limit: pageSize }));
  };

  return (
    <DataGrid
      rows={products?.products}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: products?.limitPerPage } },
      }}
      pageSizeOptions={[10, 20, 50]}
      onPaginationModelChange={(data) => stateChanged(data)}
      disableColumnResize
      rowCount={products.totalRows}
      paginationMode="server"
      pagination
      page={products.currentPage}
      pageSize={products.limitPerPage}
      loading={products.loading}
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
