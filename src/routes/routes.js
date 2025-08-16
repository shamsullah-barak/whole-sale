import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Incomes from "../pages/Income";
import Invoices from "../pages/Invoices";
import Products from "../features/products/Product";
import MasterData from "../features/master-data/MasterData";
import Categories from "../features/master-data/categories/Categories";
import Companies from "../features/master-data/companies/Companies";
import CreateCompany from "../features/master-data/companies/CreateCompany";
import EditCompany from "../features/master-data/companies/EditCompany";
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
import Units from "../features/master-data/units/Units";
import CreateUnit from "../features/master-data/units/CreateUnit";
import EditUnit from "../features/master-data/units/EditUnit";
import Partners from "../features/investment/partners";
import AddInvest from "../features/investment/addInvest";
import Investments from "../features/investment";
import Expenses from "../features/expenses";
import Suppliers from "../features/suppliers";
import Customers from "../features/customers";
import Loan from "../features/loan";

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
      element: <Loan />,
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
      path: "/stocks/:stockName",
      element: <StockItems />,
    },
    {
      path: "/suppliers",
      element: <Suppliers />,
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
      path: "/partners",
      element: <Partners />,
    },
    {
      path: "/addInvest",
      element: <AddInvest />,
    },
    {
      path: "/expenses",
      element: <Expenses />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
  ]);

  return routes;
}
