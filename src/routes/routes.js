import { useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Loans from "../pages/Loan";
import Customers from "../pages/Customers";
import Incomes from "../pages/Income";
import Invoices from "../pages/Invoices";
import Products from "../pages/Products";
import Purchases from "../pages/Purchases";
import Stock from "../pages/Stock";
import Suppliers from "../pages/Suppliers";
import Bank from "../pages/Bank";

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
      path: "/purchases",
      element: <Purchases />,
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
      path: "404",
      element: <Page404 />,
    },
  ]);

  return routes;
}
