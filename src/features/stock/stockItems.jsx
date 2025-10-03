import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { useParams, NavLink } from "react-router-dom";
import { selectDirection } from "../../store/selectors/app.selector";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockItemsAsync } from "../../store/slices/stock.items.slice";
import { selectStockItems } from "../../store/selectors/stock.items.selector";
import Datagrid from "../../components/DataGrid";
import formatDate from "../../utils/moment";
import { Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";

const columns = [
  {
    field: "productName",
    headerName: "productName",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "quantity",
    headerName: "available quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "unitType",
    headerName: "unit type",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "createdAt",
    headerName: "purchaseDate",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return formatDate(params);
    },
  },
];

const StockItemsList = () => {
  const dispatch = useDispatch();
  const stockName = useParams().stockName;
  const stockItems = useSelector(selectStockItems);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(
      fetchStockItemsAsync({ stockName, page: page + 1, limit: pageSize })
    );
  };

  return (
    <Datagrid
      rows={stockItems?.stockItems}
      columns={columns}
      limitPerPage={stockItems?.limitPerPage}
      loading={stockItems?.loading}
      totalRows={stockItems?.totalRows}
      currentPage={stockItems?.currentPage}
      stateChanged={stateChanged}
    />
  );
};

const StockItems = () => {
  const selectedDirection = useSelector(selectDirection);
  const stockItems = useSelector(selectStockItems);
  const { t } = useTranslation();

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      const loadStockItems = () => {
        dispatch(
          fetchStockItemsAsync({
            id,
            page: stockItems.currentPage,
            limit: stockItems.limitPerPage,
          })
        );
      };

      loadStockItems();
    }
  }, [dispatch, id]);

  return (
    <>
      <>
        <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
          <Grid
            xs={12}
            lg={9}
            sx={{
              width: "100%",
              textAlign: selectedDirection === "rtl" ? "left" : "right",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <NavLink to={`/stocks/${id}/add-item`}>
                <Button
                  variant="contained"
                  color="inherit"
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
                    color:
                      theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
                  })}
                >
                  {t("Add New Item")}
                </Button>
              </NavLink>
            </Box>
            <StockItemsList />
          </Grid>
        </Grid>
      </>
    </>
  );
};

export default StockItems;
