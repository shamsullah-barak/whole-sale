import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import InventoryIcon from "@mui/icons-material/Inventory";
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

const mainListItems = [
  { text: "Dashboard", icon: <EqualizerIcon />, path: "/dashboard" },
  { text: "Investment", icon: <EqualizerIcon />, path: "/investments" },
  { text: "Journal", icon: <NoteAltIcon />, path: "/journal" },
  { text: "Ledgers", icon: <ReceiptIcon />, path: "/ledgers" },
  { text: "Invoices", icon: <RequestQuoteIcon />, path: "/invoices" },
  {
    text: "Products",
    icon: <ProductionQuantityLimitsIcon />,
    path: "/products",
  },

  { text: "Customers", icon: <PeopleRoundedIcon />, path: "/customers" },
  { text: "Suppliers", icon: <PeopleRoundedIcon />, path: "/suppliers" },
  { text: "Purchases", icon: <ShoppingCartIcon />, path: "/purchases" },
  { text: "Stock", icon: <InventoryIcon />, path: "/stocks" },
  { text: "Bank", icon: <CommentBankIcon />, path: "/bank" },
  { text: "Incomes", icon: <TrendingUpIcon />, path: "/incomes" },
  { text: "Loan", icon: <CreditScoreIcon />, path: "/loan" },
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
        {mainListItems.map((item, index) => (
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
                  textAlign: selectedDirection === "rtl" ? "right" : "left",
                }}
                primary={t(`${item.text}`)}
              />
            </ListItemButton>
          </ListItem>
        ))}
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
