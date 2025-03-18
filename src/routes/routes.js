import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Loans from "../pages/Loan";
import Customers from "../pages/Customers";
import Incomes from "../pages/Income";
import Invoices from "../pages/Invoices";
import Stock from "../pages/Stock";
import Suppliers from "../pages/Suppliers";
import Bank from "../pages/Bank";
import Products from "../features/products/Product";
import CreateProduct from "../features/products/CreateProduct";
import Purchases from "../features/purchases/Purchase";
import CreatePurchases from "../features/purchases/CreatePurchase";
import Accounts from "../features/accounts/Accounts";
import SubAccount from "../features/accounts/sub";

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
      path: "/purchases",
      element: <Purchases />,
    },
    {
      path: "/purchases/add",
      element: <CreatePurchases />,
    },
    {
      path: "/stock",
      element: <Stock />,
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
      path: "/accounts",
      element: <Accounts />,
    },
    {
      path: "/accounts/:accountId",
      element: <SubAccount />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
  ]);

  return routes;
}
