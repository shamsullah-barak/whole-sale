import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createHashRouter, RouterProvider } from "react-router";
import DashboardLayout from "./components/DashboardLayout";
import EmployeeList from "./components/EmployeeList";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Products from "./features/products/Product";
import MasterData from "./features/master-data/MasterData";
import Categories from "./features/master-data/categories/Categories";
import Companies from "./features/master-data/companies/Companies";
import CreateCompany from "./features/master-data/companies/CreateCompany";
import EditCompany from "./features/master-data/companies/EditCompany";
import Purchases from "./features/purchases/Purchase";
import CreatePurchases from "./features/purchases/CreatePurchase";
import Ledgers from "./features/ledgers/Ledgers";
import SubLedger from "./features/ledgers/ledgerTransactions";
import Journal from "./features/journal";
import Settings from "./features/settings";
import Stock from "./features/stock";
import CreateStock from "./features/stock/createStock";
import StockItems from "./features/stock/stockItems";
import Units from "./features/master-data/units/Units";
import CreateUnit from "./features/master-data/units/CreateUnit";
import EditUnit from "./features/master-data/units/EditUnit";
import Partners from "./features/investment/partners";
import AddInvest from "./features/investment/addInvest";
import Expenses from "./features/expenses";
import Suppliers from "./features/suppliers";
import Customers from "./features/customers";
import Payable from "./features/payable";
import Receivable from "./features/receivable";
import Category from "./features/master-data/categories/Categories";
import CashBox from "./features/cashbox";
import Incomes from "./features/income";
import NotificationsProvider from "./hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "./hooks/useDialogs/DialogsProvider";
import AppTheme from "./shared-theme/AppTheme";
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from "./theme/customizations";
import { useDispatch } from "react-redux";

import { fetchProductsAsync } from "./store/slices/product.slice";
import { fetchJournalsAsync } from "./store/slices/journal.slice";
import { fetchLedgersAsync } from "./store/slices/ledger.slice";
import { fetchTransactionTypesAsync } from "./store/slices/transaction.types.slice";
import {
  fetchStockNamesAsync,
  fetchStocksAsync,
} from "./store/slices/stock.slice";
import { fetchPartnersAsync } from "./store/slices/investment.slice";
import { fetchExpensesAsync } from "./store/slices/expenses.slice";
import {
  fetchCustomersAsync,
  fetchSuppliersAsync,
} from "./store/slices/businessEntity.slice";
import {
  fetchDashboardDataAsync,
  fetchNextInvoiceAsync,
} from "./store/slices/purchase.slice";
import {
  fetchNextSaleNumberAsync,
  fetchSalesAsync,
} from "./store/slices/sale.slice";
import { fetchCategoriesAsync } from "./store/slices/category.slice";
import { fetchPayableAsync } from "./store/slices/payable.slice";
import { fetchReceivablesAsync } from "./store/slices/receivable.slice";
import { fetchIncomeAsync } from "./store/slices/income.slice";

const Page404 = () => {
  return <>404</>;
};

const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        path: "/employees",
        Component: EmployeeList,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/customers",
        Component: Customers,
      },
      {
        path: "/incomes",
        Component: Incomes,
      },
      {
        path: "/invoices",
        Component: Invoices,
      },
      {
        path: "/products",
        Component: Products,
      },
      // Master Data routes
      {
        path: "/master-data",
        Component: MasterData,
      },
      // Category routes
      {
        path: "/master-data/categories",
        Component: Categories,
      },
      // Company routes
      {
        path: "/master-data/companies",
        Component: Companies,
      },
      {
        path: "/master-data/companies/add",
        Component: CreateCompany,
      },
      {
        path: "/master-data/companies/edit/:companyId",
        Component: EditCompany,
      },
      {
        path: "/purchases",
        Component: Purchases,
      },
      {
        path: "/purchases/add",
        Component: CreatePurchases,
      },
      {
        path: "/stocks",
        Component: Stock,
      },
      {
        path: "/stocks/create",
        Component: CreateStock,
      },
      {
        path: "/payable",
        Component: Payable,
      },
      {
        path: "/receivable",
        Component: Receivable,
      },
      {
        path: "/stocks/:stockName",
        Component: StockItems,
      },
      {
        path: "/suppliers",
        Component: Suppliers,
      },
      {
        path: "/ledgers",
        Component: Ledgers,
      },
      {
        path: "/ledgers/:ledgerId",
        Component: SubLedger,
      },
      {
        path: "/journal",
        Component: Journal,
      },
      {
        path: "/settings",
        Component: Settings,
      },
      {
        path: "/master-data/units",
        Component: Units,
      },
      {
        path: "/master-data/units/add",
        Component: CreateUnit,
      },
      {
        path: "/master-data/units/edit/:unitId",
        Component: EditUnit,
      },
      {
        path: "/expenses",
        Component: Expenses,
      },
      {
        path: "/categories",
        Component: Category,
      },
      {
        path: "/cashbox",
        Component: CashBox,
      },
      {
        path: "/partners",
        Component: Partners,
      },
      {
        path: "/addInvest",
        Component: AddInvest,
      },
      {
        path: "/companies",
        Component: Companies,
      },
      {
        path: "404",
        Component: Page404,
      },
      //  Fallback route for the example routes in dashboard sidebar items
      {
        path: "*",
        Component: EmployeeList,
      },
    ],
  },
]);

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchPartnersAsync());
    dispatch(fetchTransactionTypesAsync());
    dispatch(fetchSalesAsync());
    dispatch(fetchPayableAsync());
    dispatch(fetchReceivablesAsync());
    dispatch(fetchNextInvoiceAsync());
    dispatch(fetchNextSaleNumberAsync());
    dispatch(fetchStockNamesAsync());
    dispatch(fetchDashboardDataAsync());
    dispatch(fetchIncomeAsync());
    dispatch(fetchCategoriesAsync({ limit: 10, page: 1 }));
    dispatch(fetchSuppliersAsync({ limit: 10, page: 1 }));
    dispatch(fetchCustomersAsync({ limit: 10, page: 1 }));
    dispatch(fetchProductsAsync({ limit: 10, page: 1 }));
    dispatch(fetchJournalsAsync({ limit: 10, page: 1 }));
    dispatch(fetchLedgersAsync({ limit: 10, page: 1 }));
    dispatch(fetchStocksAsync({ limit: 10, page: 1 }));
    dispatch(fetchExpensesAsync({ limit: 10, page: 1 }));
  }, []);

  return (
    <>
      <AppTheme {...props} themeComponents={themeComponents}>
        <CssBaseline enableColorScheme />
        <NotificationsProvider>
          <DialogsProvider>
            <RouterProvider router={router} />
          </DialogsProvider>
        </NotificationsProvider>
      </AppTheme>
    </>
  );
}
