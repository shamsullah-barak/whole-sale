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
    field: "name",
    headerName: "name",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "province",
    headerName: "province",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "district",
    headerName: "district",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "accountType",
    headerName: "account type",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "phoneNumber",
    headerName: "phone number",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "whatsAppNumber",
    headerName: "whatsApp",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];
