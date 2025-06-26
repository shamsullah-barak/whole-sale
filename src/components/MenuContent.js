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
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";

const ITEMS = [
  {
    id: "2",
    label: "investments",
    children: [
      { id: "1.1", label: "partners", color: "green" },
      { id: "1.2", label: "addInvest", color: "green" },
      { id: "1.3", label: "totalInvest", color: "green" },
    ],
  },
];

const AnimatedCollapse = animated(Collapse);

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { t } = useTranslation();

  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
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
    label: t(`${label}`),
    disabled,
    rootRef: ref,
  });

  const item = publicAPI.getItem(itemId);
  const color = item?.color;
  return (
    <TreeItem2Root {...getRootProps(other)}>
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

        <CustomLabel {...getLabelProps({ color })} />
      </TreeItem2Content>
      {children && (
        <TransitionComponent
          {...getGroupTransitionProps({ className: "groupTransition" })}
        />
      )}
    </TreeItem2Root>
  );
});

function CustomLabel({ color, expandable, children, ...other }) {
  return (
    <TreeItem2Label {...other} sx={{ display: "flex", alignItems: "center" }}>
      <Typography
        className="labelText"
        variant="body2"
        sx={{ color: "text.primary" }}
      >
        {children}
      </Typography>
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

export default function MenuContent() {
  const { pathname } = useLocation();
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => {
          return (
            <>
              {item.text === "Investment" ? (
                <>
                  <RichTreeView
                    items={ITEMS}
                    aria-label="pages"
                    defaultExpandedItems={["1", "1.1"]}
                    defaultSelectedItems={["1.1", "1.1.1"]}
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
            </>
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
