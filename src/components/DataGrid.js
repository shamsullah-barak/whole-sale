import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { selectDirection } from "../store/selectors/app.selector";
import "./DataGrid.css";

// sx={{
//   "& .MuiDataGrid-row:hover": {
//     backgroundColor: "inherit !important",
//   },
// }}

const Datagrid = ({
  rows,
  columns,
  totalRows,
  currentPage,
  limitPerPage,
  loading,
  stateChanged,
}) => {
  const selectedDirection = useSelector(selectDirection);
  return (
    <>
      <DataGrid
        rows={rows}
        style={{
          cursor: "pointer",
          textAlign: selectedDirection === "rtl" ? "left" : "right",
        }}
        columns={columns}
        getRowId={(row) => row.id}
        // onRowClick={handleRowClick}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "odd-row" : "even-row"
        }
        initialState={{
          pagination: {
            paginationModel: { pageSize: limitPerPage },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        onPaginationModelChange={(data) => stateChanged(data)}
        disableColumnResize
        rowCount={totalRows}
        paginationMode="server"
        pagination
        page={currentPage}
        pageSize={limitPerPage}
        loading={loading}
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
    </>
  );
};

export default Datagrid;
