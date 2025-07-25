import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { selectDirection } from "../../store/selectors/app.selector";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { fetchStockItemsAsync } from "../../store/slices/stock.items.slice";
import { selectStockItems } from "../../store/selectors/stock.items.selector";

const columns = [
  {
    field: "productName",
    headerName: "productName",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "stockName",
    headerName: "stockName",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "quantity",
    headerName: "quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "unitType",
    headerName: "unitType",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "unitPerPackage",
    headerName: "unitPerPackage",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "unitPrice",
    headerName: "unitPrice",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "totalPrice",
    headerName: "totalPrice",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "invoiceNo",
    headerName: "invoiceNo",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "purchaseDate",
    headerName: "purchaseDate",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "expiryDate",
    headerName: "expiryDate",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const StockItemsList = () => {
  const dispatch = useDispatch();
  const stockName = useParams().stockName;
  const stockItems = useSelector(selectStockItems);
  const selectedDirection = useSelector(selectDirection);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(
      fetchStockItemsAsync({ stockName, page: page + 1, limit: pageSize })
    );
  };

  return (
    <DataGrid
      rows={stockItems?.stockItems}
      style={{
        cursor: "pointer",
        textAlign: selectedDirection === "rtl" ? "left" : "right",
      }}
      columns={columns}
      getRowId={(row) => row.id}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: stockItems?.limitPerPage } },
      }}
      pageSizeOptions={[10, 20, 50]}
      onPaginationModelChange={(data) => stateChanged(data)}
      disableColumnResize
      rowCount={stockItems?.totalRows}
      paginationMode="server"
      pagination
      page={stockItems?.currentPage}
      pageSize={stockItems?.limitPerPage}
      loading={stockItems?.loading}
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

const StockItems = () => {
  const selectedDirection = useSelector(selectDirection);
  const stockItems = useSelector(selectStockItems);

  const stockName = useParams().stockName;
  const dispatch = useDispatch();

  useEffect(() => {
    const loadStockItems = () => {
      dispatch(
        fetchStockItemsAsync({
          stockName,
          page: stockItems.currentPage,
          limit: stockItems.limitPerPage,
        })
      );
    };

    loadStockItems();
  }, []);
  return (
    <>
      <MainDashboard title="StockItems">
        <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
          <Grid
            xs={12}
            lg={9}
            sx={{
              width: "100%",
              textAlign: selectedDirection === "rtl" ? "left" : "right",
            }}
          >
            <StockItemsList />
          </Grid>
        </Grid>
      </MainDashboard>
    </>
  );
};

export default StockItems;
