import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { matchPath, useLocation } from "react-router";
import DashboardSidebarContext from "../context/DashboardSidebarContext";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "../constants";
import DashboardSidebarPageItem from "./DashboardSidebarPageItem";
import DashboardSidebarDividerItem from "./DashboardSidebarDividerItem";
import {
  getDrawerSxTransitionMixin,
  getDrawerWidthTransitionMixin,
} from "../mixins";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import StraightenIcon from "@mui/icons-material/Straighten";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useSelector } from "react-redux";
import { selectDirection } from "../store/selectors/app.selector";

function DashboardSidebar({
  expanded = true,
  setExpanded,
  disableCollapsibleSidebar = false,
  container,
}) {
  const selectedDirection = useSelector(selectDirection);
  const theme = useTheme();

  const { pathname } = useLocation();

  const [expandedItemIds, setExpandedItemIds] = React.useState([]);

  const isOverSmViewport = useMediaQuery(theme.breakpoints.up("sm"));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

  React.useEffect(() => {
    if (expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyExpanded(false);

    return () => {};
  }, [expanded, theme.transitions.duration.enteringScreen]);

  React.useEffect(() => {
    if (!expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyCollapsed(true);
      }, theme.transitions.duration.leavingScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyCollapsed(false);

    return () => {};
  }, [expanded, theme.transitions.duration.leavingScreen]);

  const mini = !disableCollapsibleSidebar && !expanded;

  const handleSetSidebarExpanded = React.useCallback(
    (newExpanded) => () => {
      setExpanded(newExpanded);
    },
    [setExpanded]
  );

  const handlePageItemClick = React.useCallback(
    (itemId, hasNestedNavigation) => {
      if (hasNestedNavigation && !mini) {
        setExpandedItemIds((previousValue) =>
          previousValue.includes(itemId)
            ? previousValue.filter(
                (previousValueItemId) => previousValueItemId !== itemId
              )
            : [...previousValue, itemId]
        );
      } else if (!isOverSmViewport && !hasNestedNavigation) {
        setExpanded(false);
      }
    },
    [mini, setExpanded, isOverSmViewport]
  );

  const hasDrawerTransitions =
    isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const getDrawerContent = React.useCallback(
    (viewport) => (
      <React.Fragment>
        <Toolbar />
        <Box
          component="nav"
          aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
            scrollbarGutter: mini ? "stable" : "auto",
            overflowX: "hidden",
            pt: !mini ? 0 : 2,
            ...(hasDrawerTransitions
              ? getDrawerSxTransitionMixin(isFullyExpanded, "padding")
              : {}),
          }}
        >
          <List
            dense
            sx={{
              padding: mini ? 0 : 0.5,
              mb: 4,
              width: mini ? MINI_DRAWER_WIDTH : "auto",
            }}
          >
            <DashboardSidebarPageItem
              id="overview"
              title="Overview"
              icon={<EqualizerIcon />}
              href="/dashboard"
              selected={!!matchPath("/dashboard", pathname) || pathname === "/"}
            />

            <DashboardSidebarDividerItem />

            <DashboardSidebarPageItem
              id="sales-group"
              title="Sales"
              icon={<PointOfSaleIcon />}
              defaultExpanded={
                !!matchPath("/invoices", pathname) ||
                !!matchPath("/sales", pathname)
              }
              expanded={expandedItemIds.includes("sales-group")}
              nestedNavigation={
                <List
                  dense
                  sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}
                >
                  <DashboardSidebarPageItem
                    id="invoices"
                    title="Invoices"
                    icon={<RequestQuoteIcon />}
                    href="/invoices"
                    selected={!!matchPath("/invoices", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="sales"
                    title="Sales"
                    icon={<PointOfSaleIcon />}
                    href="/sales"
                    selected={!!matchPath("/sales", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="sale-returns"
                    title="Sale Returns"
                    icon={<KeyboardReturnIcon />}
                    href="/sales/returns"
                    selected={!!matchPath("/sales/returns", pathname)}
                  />
                </List>
              }
            />

            <DashboardSidebarPageItem
              id="purchases-group"
              title="Purchases"
              icon={<ShoppingCartIcon />}
              defaultExpanded={!!matchPath("/purchases", pathname)}
              expanded={expandedItemIds.includes("purchases-group")}
              nestedNavigation={
                <List
                  dense
                  sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}
                >
                  <DashboardSidebarPageItem
                    id="purchases"
                    title="Purchases"
                    icon={<ShoppingCartIcon />}
                    href="/purchases"
                    selected={!!matchPath("/purchases", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="purchase-returns"
                    title="Purchase Returns"
                    icon={<KeyboardReturnIcon />}
                    href="/purchases/returns"
                    selected={!!matchPath("/purchases/returns", pathname)}
                  />
                </List>
              }
            />

            <DashboardSidebarPageItem
              id="inventory-group"
              title="Inventory"
              icon={<InventoryIcon />}
              defaultExpanded={
                !!matchPath("/products", pathname) ||
                !!matchPath("/stocks", pathname) ||
                !!matchPath("/categories", pathname) ||
                !!matchPath("/companies", pathname) ||
                !!matchPath("/master-data/units", pathname)
              }
              expanded={expandedItemIds.includes("inventory-group")}
              nestedNavigation={
                <List
                  dense
                  sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}
                >
                  <DashboardSidebarPageItem
                    id="companies"
                    title="Companies"
                    icon={<BusinessIcon />}
                    href="/companies"
                    selected={!!matchPath("/companies", pathname)}
                  />

                  <DashboardSidebarPageItem
                    id="units"
                    title="Units"
                    icon={<StraightenIcon />}
                    href="/master-data/units"
                    selected={!!matchPath("/units", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="categories"
                    title="Categories"
                    icon={<LayersIcon />}
                    href="/categories"
                    selected={!!matchPath("/categories", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="products"
                    title="Products"
                    icon={<ProductionQuantityLimitsIcon />}
                    href="/products"
                    selected={!!matchPath("/products", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="stocks"
                    title="Stock"
                    icon={<InventoryIcon />}
                    href="/stocks"
                    selected={!!matchPath("/stocks", pathname)}
                  />
                </List>
              }
            />

            <DashboardSidebarPageItem
              id="people-group"
              title="People"
              icon={<PeopleRoundedIcon />}
              defaultExpanded={
                !!matchPath("/customers", pathname) ||
                !!matchPath("/suppliers", pathname)
              }
              expanded={expandedItemIds.includes("people-group")}
              nestedNavigation={
                <List
                  dense
                  sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}
                >
                  <DashboardSidebarPageItem
                    id="customers"
                    title="Customers"
                    icon={<PeopleRoundedIcon />}
                    href="/customers"
                    selected={!!matchPath("/customers", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="suppliers"
                    title="Suppliers"
                    icon={<PeopleRoundedIcon />}
                    href="/suppliers"
                    selected={!!matchPath("/suppliers", pathname)}
                  />
                </List>
              }
            />

            <DashboardSidebarPageItem
              id="finance-group"
              title="Finance"
              icon={<AttachMoneyIcon />}
              defaultExpanded={
                !!matchPath("/incomes", pathname) ||
                !!matchPath("/expenses", pathname) ||
                !!matchPath("/payable", pathname) ||
                !!matchPath("/receivable", pathname) ||
                !!matchPath("/installments", pathname) ||
                !!matchPath("/cashbox", pathname) ||
                !!matchPath("/ledgers", pathname) ||
                !!matchPath("/journal", pathname)
              }
              expanded={expandedItemIds.includes("finance-group")}
              nestedNavigation={
                <List
                  dense
                  sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}
                >
                  <DashboardSidebarPageItem
                    id="incomes"
                    title="Incomes"
                    icon={<TrendingUpIcon />}
                    href="/incomes"
                    selected={!!matchPath("/incomes", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="expenses"
                    title="Expenses"
                    icon={<AttachMoneyIcon />}
                    href="/expenses"
                    selected={!!matchPath("/expenses", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="payable"
                    title="Payable"
                    icon={<PaymentsIcon />}
                    href="/payable"
                    selected={!!matchPath("/payable", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="receivable"
                    title="Receivable"
                    icon={<ArrowUpwardIcon />}
                    href="/receivable"
                    selected={!!matchPath("/receivable", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="installments"
                    title="Installments"
                    icon={<AccountBalanceWalletIcon />}
                    href="/installments"
                    selected={!!matchPath("/installments", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="cashbox"
                    title="CashBox"
                    icon={<AttachMoneyIcon />}
                    href="/cashbox"
                    selected={!!matchPath("/cashbox", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="ledgers"
                    title="Ledgers"
                    icon={<ReceiptIcon />}
                    href="/ledgers"
                    selected={!!matchPath("/ledgers", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="journal"
                    title="Journal"
                    icon={<NoteAltIcon />}
                    href="/journal"
                    selected={!!matchPath("/journal", pathname)}
                  />
                </List>
              }
            />

            <DashboardSidebarPageItem
              id="reports"
              title="Reports"
              icon={<BarChartIcon />}
              href="/reports"
              selected={!!matchPath("/reports", pathname)}
              defaultExpanded={!!matchPath("/reports", pathname)}
              expanded={expandedItemIds.includes("reports")}
              nestedNavigation={
                <List
                  dense
                  sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}
                >
                  <DashboardSidebarPageItem
                    id="reports-balance-sheet"
                    title="Balance Sheet"
                    icon={<DescriptionIcon />}
                    href="/reports/balance-sheet"
                    selected={!!matchPath("/reports/balance-sheet", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="reports-profit-loss"
                    title="Profit & Loss"
                    icon={<DescriptionIcon />}
                    href="/reports/profit-loss"
                    selected={!!matchPath("/reports/profit-loss", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="reports-trial-balance"
                    title="Trial Balance"
                    icon={<DescriptionIcon />}
                    href="/reports/trial-balance"
                    selected={!!matchPath("/reports/trial-balance", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="reports-cash-flow"
                    title="Cash Flow"
                    icon={<DescriptionIcon />}
                    href="/reports/cash-flow"
                    selected={!!matchPath("/reports/cash-flow", pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="reports-ledger"
                    title="Ledger"
                    icon={<DescriptionIcon />}
                    href="/reports/ledger"
                    selected={!!matchPath("/reports/ledger", pathname)}
                  />
                </List>
              }
            />

            <DashboardSidebarPageItem
              id="administration-group"
              title="Administration"
              icon={<LayersIcon />}
              defaultExpanded={!!matchPath("/settings", pathname)}
              expanded={expandedItemIds.includes("administration-group")}
              nestedNavigation={
                <List
                  dense
                  sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}
                >
                  <DashboardSidebarPageItem
                    id="settings"
                    title="Settings"
                    icon={<SettingsIcon />}
                    href="/settings"
                    selected={!!matchPath("/settings", pathname)}
                  />
                </List>
              }
            />
          </List>
        </Box>
      </React.Fragment>
    ),
    [mini, hasDrawerTransitions, isFullyExpanded, expandedItemIds, pathname]
  );

  const getDrawerSharedSx = React.useCallback(
    (isTemporary) => {
      const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

      return {
        displayPrint: "none",
        width: drawerWidth,
        flexShrink: 0,
        ...getDrawerWidthTransitionMixin(expanded),
        ...(isTemporary ? { position: "absolute" } : {}),
        [`& .MuiDrawer-paper`]: {
          position: "absolute",
          width: drawerWidth,
          height: "100vh",
          boxSizing: "border-box",
          backgroundImage: "none",
          ...getDrawerWidthTransitionMixin(expanded),
        },
      };
    },
    [expanded, mini]
  );

  const sidebarContextValue = React.useMemo(() => {
    return {
      onPageItemClick: handlePageItemClick,
      mini,
      fullyExpanded: isFullyExpanded,
      fullyCollapsed: isFullyCollapsed,
      hasDrawerTransitions,
    };
  }, [
    handlePageItemClick,
    mini,
    isFullyExpanded,
    isFullyCollapsed,
    hasDrawerTransitions,
  ]);

  return (
    <DashboardSidebarContext.Provider value={sidebarContextValue}>
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={handleSetSidebarExpanded(false)}
        anchor={selectedDirection === "rtl" ? "right" : "left"}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: "block",
            sm: disableCollapsibleSidebar ? "block" : "none",
            md: "none",
          },
          ...getDrawerSharedSx(true),
        }}
      >
        {getDrawerContent("phone")}
      </Drawer>
      <Drawer
        variant="permanent"
        anchor={selectedDirection === "rtl" ? "right" : "left"}
        sx={{
          display: {
            xs: "none",
            sm: disableCollapsibleSidebar ? "none" : "block",
            md: "none",
          },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent("tablet")}
      </Drawer>
      <Drawer
        variant="permanent"
        anchor={selectedDirection === "rtl" ? "right" : "left"}
        sx={{
          display: { xs: "none", md: "block" },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent("desktop")}
      </Drawer>
    </DashboardSidebarContext.Provider>
  );
}

DashboardSidebar.propTypes = {
  container: (props, propName) => {
    if (props[propName] == null) {
      return null;
    }
    if (typeof props[propName] !== "object" || props[propName].nodeType !== 1) {
      return new Error(`Expected prop '${propName}' to be of type Element`);
    }
    return null;
  },
  disableCollapsibleSidebar: PropTypes.bool,
  expanded: PropTypes.bool,
  setExpanded: PropTypes.func.isRequired,
};

export default DashboardSidebar;
