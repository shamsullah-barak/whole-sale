import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Loans from "../pages/Loan";
import Customers from "../pages/Customers";
import Incomes from "../pages/Income";
import Invoices from "../pages/Invoices";
import Suppliers from "../pages/Suppliers";
import Bank from "../pages/Bank";
import Products from "../features/products/Product";
import CreateProduct from "../features/products/CreateProduct";
import Purchases from "../features/purchases/Purchase";
import CreatePurchases from "../features/purchases/CreatePurchase";
import Ledgers from "../features/ledgers/Ledgers";
import CreateLedger from "../features/ledgers/CreateLedger";
import SubLedger from "../features/ledgers/ledgerTransactions";
import Journal from "../features/journal";
import Settings from "../features/settings";
import Stock from "../features/stock";
import CreateStock from "../features/stock/createStock";
import StockItems from "../features/stock/stockItems";
import Investments from "../features/investment";

// ----------------------------------------------------------------------

const Page404 = () => {
  return <>404</>;
};

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/customers",
      element: <Customers />,
    },
    {
      path: "/loan",
      element: <Loans />,
    },
    {
      path: "/incomes",
      element: <Incomes />,
    },
    {
      path: "/invoices",
      element: <Invoices />,
    },
    {
      path: "/products",
      element: <Products />,
    },
    {
      path: "/products/add",
      element: <CreateProduct />,
    },
    {
      path: "/products/edit/:productId",
      element: <EditProduct />,
    },
    // Master Data routes
    {
      path: "/master-data",
      element: <MasterData />,
    },
    // Category routes
    {
      path: "/master-data/categories",
      element: <Categories />,
    },
    {
      path: "/master-data/categories/add",
      element: <CreateCategory />,
    },
    {
      path: "/master-data/categories/edit/:categoryId",
      element: <EditCategory />,
    },
    // Company routes
    {
      path: "/master-data/companies",
      element: <Companies />,
    },
    {
      path: "/master-data/companies/add",
      element: <CreateCompany />,
    },
    {
      path: "/master-data/companies/edit/:companyId",
      element: <EditCompany />,
    },
    {
      path: "/purchases",
      element: <Purchases />,
    },
    {
      path: "/purchases/add",
      element: <CreatePurchases />,
    },
    {
      path: "/stocks",
      element: <Stock />,
    },
    {
      path: "/stocks/create",
      element: <CreateStock />,
    },
    {
      path: "/stocks/:stockId",
      element: <StockItems />,
    },
    {
      path: "/suppliers",
      element: <Suppliers />,
    },
    {
      path: "/bank",
      element: <Bank />,
    },
    {
      path: "/ledgers",
      element: <Ledgers />,
    },
    {
      path: "/ledgers/create",
      element: <CreateLedger />,
    },
    {
      path: "/ledgers/:ledgerId",
      element: <SubLedger />,
    },
    {
      path: "/journal",
      element: <Journal />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/investments",
      element: <Investments />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
  ]);

  return routes;
}
