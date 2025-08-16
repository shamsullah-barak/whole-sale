import React from "react";
import { useSelector } from "react-redux";
import MainDashboard from "../../theme/main/MainDashboard";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectProducts } from "../../store/selectors/product.selector";

const LoanList = () => {
  const { t } = useTranslation();

  const selectedDirection = useSelector(selectDirection);

  const products = useSelector(selectProducts);

  const handleRowClick = () => {};
  const stateChanged = (data) => {};

  const columns = [
    {
      field: "name",
      headerName: "Product Name",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "categoryId",
      headerName: "Category",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
    },
  ];

  return (
    <>
      {products.products.length === 0 ? (
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
            rows={products?.products}
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
                paginationModel: { pageSize: products?.limitPerPage },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            onPaginationModelChange={(data) => stateChanged(data)}
            disableColumnResize
            rowCount={products?.totalRows}
            paginationMode="server"
            pagination
            page={products?.currentPage}
            pageSize={products?.limitPerPage}
            loading={products?.loading}
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

const Loan = () => {
  return (
    <>
      <MainDashboard title="Loan">
        <LoanList />
      </MainDashboard>
    </>
  );
};

export default Loan;
