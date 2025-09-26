import React, { useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchasesAsync } from "../../store/slices/purchase.slice";
import { selectPurchases } from "../../store/selectors/purchase.selector";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Datagrid from "../../components/DataGrid";

const PurchaseList = () => {
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
    <Datagrid
      rows={purchases?.purchases}
      columns={columns}
      limitPerPage={purchases?.limitPerPage}
      loading={purchases?.loading}
      totalRows={purchases?.totalRows}
      currentPage={purchases?.currentPage}
      stateChanged={stateChanged}
    />
  );
};

const columns = [
  {
    field: "quantity",
    headerName: "quantity",
    flex: 0.5,
    minWidth: 80,
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
    field: "unitPerPackage",
    headerName: "unit per package",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },
  {
    field: "unitPrice",
    headerName: "unit price",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },
  {
    field: "totalPrice",
    headerName: "total price",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },
  {
    field: "discount",
    headerName: "discount",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },
  {
    field: "paymentMethod",
    headerName: "payment method",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
  change,
  changeColor,
  changeText,
  extra,
}) => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 1,
        boxShadow: 3,
        height: "100%",
        width: "100%",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: iconColor }}>{icon}</Avatar>
      </Box>
      {extra && <Box mt={2}>{extra}</Box>}
      <Box mt={1} display="flex" alignItems="center" gap={1}>
        {change > 0 ? (
          <ArrowUpward color="success" fontSize="small" />
        ) : (
          <ArrowDownward color="error" fontSize="small" />
        )}
        <Typography variant="body2" color={changeColor}>
          {Math.abs(change)}%
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {changeText}
        </Typography>
      </Box>
    </Card>
  );
};

const Cards = () => {
  const purchases = useSelector(selectPurchases);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
        <StatCard
          title="Total Purchases"
          value={purchases.totalPurchases}
          icon={<ShoppingCartIcon />}
          iconColor="orange"
          change={-4}
          changeColor="red"
          changeText="Since last month"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
        <StatCard
          title="Total Purchase on Cash"
          value={purchases.totalCashPurchases}
          icon={<AttachMoneyIcon />}
          iconColor="mediumseagreen"
          change={-16}
          changeColor="red"
          changeText="Since last month"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
        <StatCard
          title="Total Purchase on Credit"
          value={purchases.totalCreditPurchases}
          icon={<ReceiptLongIcon />}
          iconColor="orange"
          change={0}
          changeColor="textSecondary"
          changeText=""
          extra={
            <LinearProgress
              variant="determinate"
              value={75.5}
              sx={{ height: 6, borderRadius: 5 }}
            />
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
        <StatCard
          title="Total purchase on Credit and Cash"
          value={purchases.totalCashAndCreditPurchases}
          icon={<AccountBalanceWalletIcon />}
          iconColor="blueviolet"
          change={0}
          changeColor="textSecondary"
          changeText=""
        />
      </Grid>
    </Grid>
  );
};

export default function DashboardCards() {
  return (
    <>
      <Cards />
      <Grid container spacing={2}>
        <PurchaseList />
      </Grid>
    </>
  );
}
