import { useRoutes } from "react-router-dom";
import Dashboard from "../Dashboard";

// ----------------------------------------------------------------------

const LoginPage = () => {
  return <>Please Login</>;
};

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
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
  ]);

  return routes;
}
