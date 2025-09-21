import React from "react";
import { useSelector } from "react-redux";
import MainDashboard from "../../theme/main/MainDashboard";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectPayable } from "../../store/selectors/payable.selector";

const PayableList = () => {
  const { t } = useTranslation();

  const selectedDirection = useSelector(selectDirection);

  const payable = useSelector(selectPayable);

  const handleRowClick = () => {};
  const stateChanged = (data) => {};

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "address",
      headerName: "address",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 0.5,
      minWidth: 80,
    },
  ];

  return (
    <>
      {payable.payable.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          {t("No Data found")}
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <DataGrid
            rows={payable?.payable}
            style={{
              cursor: "pointer",
              textAlign: selectedDirection === "rtl" ? "left" : "right",
            }}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: payable?.limitPerPage },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(data) => stateChanged(data)}
            disableColumnResize
            rowCount={payable?.totalRows}
            paginationMode="server"
            pagination
            page={payable?.currentPage}
            pageSize={payable?.limitPerPage}
            loading={payable?.loading}
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
        </div>
      )}
    </>
  );
};

const Payable = () => {
  return (
    <>
      <MainDashboard title="Payable">
        <PayableList />
      </MainDashboard>
    </>
  );
};

export default Payable;
