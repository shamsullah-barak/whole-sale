import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "../internals/data/gridData";
import { useSelector } from "react-redux";
import { selectProducts } from "../features/products/productSlice";

const CustomizedDataGrid = () => {
  const products = useSelector(selectProducts);

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
      disableColumnResize
      rowCount={products.totalRows} // Total number of records
      paginationMode="server" // Enable server-side pagination
      pagination
      page={products.currentPage}
      pageSize={products.limitPerPage}
      onPageChange={(newPage) => console.log({ newPage })}
      onPageSizeChange={(newPageSize) => {
        console.log({ newPageSize });
      }}
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
