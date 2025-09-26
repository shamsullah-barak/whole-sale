import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

export default function ScrollableContainer({ children, sx, ...props }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "auto",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

ScrollableContainer.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};


