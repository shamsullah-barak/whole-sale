import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BreadcrumbNavigation = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      {items.map((item, index) => {
        if (index === items.length - 1) {
          // Last item (current page)
          return (
            <Typography key={index} color="text.primary">
              {item.icon && <item.icon sx={{ mr: 0.5, verticalAlign: "middle" }} />}
              {item.label}
            </Typography>
          );
        } else {
          // Clickable items
          return (
            <Link
              key={index}
              color="inherit"
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                if (item.onClick) {
                  item.onClick();
                } else if (item.href) {
                  navigate(item.href);
                }
              }}
              sx={{ 
                display: "flex", 
                alignItems: "center",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {item.icon && <item.icon sx={{ mr: 0.5, fontSize: "inherit" }} />}
              {item.label}
            </Link>
          );
        }
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigation;

