import * as React from "react";
import Chip from "@mui/material/Chip";

function renderStatus(status) {
  const colors = {
    Online: "success",
    Offline: "default",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export const columns = [
  {
    field: "paymentStatus",
    headerName: "status",
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: "quantity",
    headerName: "quantity",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "purchasedPrice",
    headerName: "purchased price",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },
  {
    field: "totalPrice",
    headerName: "total cost",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
    valueFormatter: (params) => {
      return params ? params.toFixed(2) : 0.0;
    },
  },

  {
    field: "notes",
    headerName: "Notes",
    flex: 1,
  },
];
