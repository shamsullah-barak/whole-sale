import React from "react";
import { useSelector } from "react-redux";
import MainDashboard from "../../theme/main/MainDashboard";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectProducts } from "../../store/selectors/product.selector";
import { selectReceivables } from "../../store/selectors/receivable.selector";

const ReceivableList = () => {
  const { t } = useTranslation();

  const selectedDirection = useSelector(selectDirection);

  const receivables = useSelector(selectReceivables);

  const handleRowClick = () => {};
  const stateChanged = (data) => {};

  const columns = [
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 0.5,
      minWidth: 80,
    },
  ];

  return (
    <>
      {receivables.receivables.length === 0 ? (
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
            rows={receivables?.receivables}
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
                paginationModel: { pageSize: receivables?.limitPerPage },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(data) => stateChanged(data)}
            disableColumnResize
            rowCount={receivables?.totalRows}
            paginationMode="server"
            pagination
            page={receivables?.currentPage}
            pageSize={receivables?.limitPerPage}
            loading={receivables?.loading}
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

const Receivable = () => {
  return (
    <>
      <MainDashboard title="Receivable">
        <ReceivableList />
      </MainDashboard>
    </>
  );
};

export default Receivable;
