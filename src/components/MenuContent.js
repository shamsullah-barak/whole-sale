import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { NavLink } from "react-router-dom";

const mainListItems = [
  { text: "Dashboard", icon: <AnalyticsRoundedIcon />, path: "/dashboard" },
  { text: "Invoices", icon: <HomeRoundedIcon />, path: "/invoices" },
  { text: "Products", icon: <HomeRoundedIcon />, path: "/products" },
  { text: "Customers", icon: <PeopleRoundedIcon />, path: "/customers" },
  { text: "Suppliers", icon: <PeopleRoundedIcon />, path: "/suppliers" },
  { text: "Purchases", icon: <HomeRoundedIcon />, path: "/purchases" },
  { text: "Stock", icon: <HomeRoundedIcon />, path: "/stock" },
  { text: "Bank", icon: <HomeRoundedIcon />, path: "/bank" },
  { text: "Incomes", icon: <HomeRoundedIcon />, path: "/incomes" },
  { text: "Loan", icon: <HomeRoundedIcon />, path: "/loan" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            component={NavLink}
            to={item.path}
            style={{ textDecoration: "none", color: "white" }}
            sx={{
              display: "block",
              "&.active": {
                color: "text.primary",
                bgcolor: "action.selected",
                fontWeight: "fontWeightBold",
              },
            }}
          >
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
