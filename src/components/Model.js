import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Modal, Stack } from "@mui/material";
import COLORS from "../constant/colors";
import { useTranslation } from "react-i18next";

const Model = ({
  open,
  handleClose,
  handleSubmit,
  cancel,
  submit,
  children,
  loading,
  submitColor,
  disabled,
}) => {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {children}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          marginTop={3}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            color="secondary"
            sx={{ width: "130px" }}
          >
            {t(`${cancel}`)}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={disabled}
            loading={loading}
            loadingPosition="start"
            color="inherit"
            sx={(theme) => ({
              width: "130px",
              backgroundColor:
                theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
              color:
                theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
            })}
          >
            {t(`${submit}`)}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default Model;
