import clsx from "clsx";
import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ListItemText from "@mui/material/ListItemText";
import { animated, useSpring } from "@react-spring/web";
import ListItemButton from "@mui/material/ListItemButton";
import InventoryIcon from "@mui/icons-material/Inventory";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CommentBankIcon from "@mui/icons-material/CommentBank";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import COLORS from "../constant/colors";
import { useSelector } from "react-redux";
import { selectDirection } from "../store/selectors/app.selector";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { unstable_useTreeItem2 as useTreeItem2 } from "@mui/x-tree-view/useTreeItem2";
import StorageIcon from "@mui/icons-material/Storage";

import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";

const mainListItems = [
  { text: "Dashboard", icon: <EqualizerIcon />, path: "/dashboard" },
  { text: "Journal", icon: <NoteAltIcon />, path: "/journal" },
  { text: "Ledgers", icon: <ReceiptIcon />, path: "/ledgers" },
  { text: "Invoices", icon: <RequestQuoteIcon />, path: "/invoices" },
  {
    text: "Products",
    icon: <ProductionQuantityLimitsIcon />,
    path: "/products",
  },
  {
    text: "Master Data",
    icon: <StorageIcon />,
    path: "/master-data",
  },

  { text: "Customers", icon: <PeopleRoundedIcon />, path: "/customers" },
  { text: "Suppliers", icon: <PeopleRoundedIcon />, path: "/suppliers" },
  { text: "Purchases", icon: <ShoppingCartIcon />, path: "/purchases" },
  { text: "Stock", icon: <InventoryIcon />, path: "/stocks" },
  { text: "Bank", icon: <CommentBankIcon />, path: "/bank" },
  { text: "Incomes", icon: <TrendingUpIcon />, path: "/incomes" },
  { text: "Loan", icon: <CreditScoreIcon />, path: "/loan" },
  { text: "Investment", icon: <EqualizerIcon />, path: "/investments" },
  { text: "CashBox", icon: <AttachMoneyIcon />, path: "/cashbox" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" },
];

const ITEMS = [
  {
    id: "1",
    label: "investments",
    disabled: true,
    children: [
      { id: "2", label: "partners", path: "/partners" },
      { id: "3", label: "addInvest", path: "/addInvest" },
      { id: "4", label: "totalInvest", path: "/totalInvest" },
    ],
  },
];

const AnimatedCollapse = animated(Collapse);

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { t } = useTranslation();

  const { id, itemId, label, disabled, children } = props;
  const {
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({
    id,
    itemId,
    children,
    label: t(label),
    disabled,
    rootRef: ref,
  });

  const item = publicAPI.getItem(itemId);
  const color = item?.color;
  return (
    <React.Fragment key={itemId}>
      <TreeItem2Content
        {...getContentProps({
          className: clsx("content", {
            expanded: status.expanded,
            selected: status.selected,
            focused: status.focused,
            disabled: status.disabled,
          }),
        })}
      >
        {status.expandable && (
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
        )}

        <CustomLabel
          {...getLabelProps({ color })}
          {...(item.path && { path: item.path })}
        />
      </TreeItem2Content>
      {children && (
        <TransitionComponent
          {...getGroupTransitionProps({ className: "groupTransition" })}
        />
      )}
    </React.Fragment>
  );
});

function CustomLabel({ color, expandable, path, children, ...other }) {
  const { pathname } = useLocation();
  const isActive = pathname === path;
  return (
    <TreeItem2Label {...other} sx={{ display: "flex", alignItems: "center" }}>
      <ListItem
        disabled={true}
        disablePadding
        component={NavLink}
        to={path}
        style={{ textDecoration: "none" }}
        sx={(theme) => ({
          display: "block",
          borderRadius: "5px",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          textAlign: "right",
          ...(isActive && {
            color: COLORS.WHITE,
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.action.selected
                : COLORS.PURPLE,
            fontWeight: theme.typography.fontWeightBold,
          }),
        })}
      >
        <ListItemButton selected={pathname === path}>
          <ListItemText primary={children} />
        </ListItemButton>
      </ListItem>
    </TreeItem2Label>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

export default function MenuContent() {
  const { pathname } = useLocation();
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();

  const isCollapsed =
    pathname === "/partners" ||
    pathname === "/addInvest" ||
    pathname === "totalInvest";

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {item.text === "Investment" ? (
                <>
                  <RichTreeView
                    items={ITEMS}
                    defaultExpandedItems={isCollapsed ? ["1"] : []}
                    aria-label="pages"
                    sx={{
                      m: "0 -8px",
                      pb: "8px",
                      height: "fit-content",
                      flexGrow: 1,
                      overflowY: "auto",
                    }}
                    slots={{ item: CustomTreeItem }}
                  />
                </>
              ) : (
                <>
                  <ListItem
                    key={index}
                    disablePadding
                    component={NavLink}
                    to={item.path}
                    style={{ textDecoration: "none" }}
                    sx={(theme) => ({
                      display: "block",
                      borderRadius: "5px",
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                      textAlign: "right",
                      "&.active": {
                        color: COLORS.WHITE,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? theme.palette.action.selected
                            : COLORS.PURPLE,
                        fontWeight: theme.typography.fontWeightBold,
                      },
                    })}
                  >
                    <ListItemButton selected={pathname === item.path}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        style={{
                          textAlign:
                            selectedDirection === "rtl" ? "right" : "left",
                        }}
                        primary={t(`${item.text}`)}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </React.Fragment>
          );
        })}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            component={NavLink}
            to={item.path}
            style={{ textDecoration: "none" }}
            sx={(theme) => ({
              display: "block",
              borderRadius: "5px",
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              textAlign: "right",
              "&.active": {
                color: COLORS.WHITE,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? theme.palette.action.selected
                    : COLORS.PURPLE,
                fontWeight: theme.typography.fontWeightBold,
              },
            })}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                style={{
                  textAlign: selectedDirection === "rtl" ? "right" : "left",
                }}
                primary={t(item.text)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
