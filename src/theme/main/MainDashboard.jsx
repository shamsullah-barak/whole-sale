import * as React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "../../components/AppNavbar";
import Header from "../../components/Header";
import CircularProgress from "@mui/material/CircularProgress";
import SideMenu from "../../components/SideMenu";
import AppTheme from "../../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../../theme/customizations";
import { useSelector } from "react-redux";
import {
  selectAppLoading,
  selectDirection,
} from "../../store/selectors/app.selector";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const MainDashboard = (props) => {
  const selectedDirection = useSelector(selectDirection);
  const appLoading = useSelector(selectAppLoading);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      {appLoading ? (
        <Box
          sx={{
            height: "100vh", // Full viewport height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size="5rem" color="" />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", direction: selectedDirection }}>
            <SideMenu />
            <AppNavbar />
            {/* Main content */}
            <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: theme.vars
                  ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                  : alpha(theme.palette.background.default, 1),
                overflow: "auto",
              })}
            >
              <Stack
                spacing={2}
                sx={{
                  alignItems: "center",
                  mx: 3,
                  pb: 5,
                  mt: { xs: 8, md: 0 },
                }}
              >
                <Header title={props.title} />
                {/* <MainGrid /> */}
                {props.children}
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </AppTheme>
  );
};

export default MainDashboard;
