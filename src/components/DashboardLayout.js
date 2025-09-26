import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { selectAppLoading } from "../store/selectors/app.selector";

export default function DashboardLayout() {
  const theme = useTheme();
  const appLoading = useSelector(selectAppLoading);

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] =
    React.useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] =
    React.useState(false);

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [
      isOverMdViewport,
      setIsDesktopNavigationExpanded,
      setIsMobileNavigationExpanded,
    ]
  );

  const handleToggleHeaderMenu = React.useCallback(
    (isExpanded) => {
      setIsNavigationExpanded(isExpanded);
    },
    [setIsNavigationExpanded]
  );

  const layoutRef = React.useRef(null);

  return (
    <Box
      ref={layoutRef}
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <DashboardHeader
        // logo={<SitemarkIcon />}
        title=""
        menuOpen={isNavigationExpanded}
        onToggleMenu={handleToggleHeaderMenu}
      />
      <DashboardSidebar
        expanded={isNavigationExpanded}
        setExpanded={setIsNavigationExpanded}
        container={layoutRef?.current ?? undefined}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ displayPrint: "none" }} />
        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Backdrop
            open={appLoading}
            sx={{
              color: "#fff",
              zIndex: (t) => t.zIndex.drawer + 2,
              position: "absolute",
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              boxSizing: "border-box",
              p: { xs: 2, sm: 3 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
