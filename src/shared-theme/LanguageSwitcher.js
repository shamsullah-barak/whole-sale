import React, { Fragment, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch } from "react-redux";
import { changeLanguage, closeAppLoading } from "../store/slices/app.slice";

const LanguageSwitcher = (props) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { i18n } = useTranslation();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMode = (language) => () => {
    i18n.changeLanguage(language);
    dispatch(changeLanguage({ language }));
    setTimeout(() => {
      dispatch(closeAppLoading());
    }, 500);
    handleClose();
  };

  return (
    <Fragment>
      <IconButton
        data-screenshot="toggle-mode"
        onClick={handleClick}
        disableRipple
        size="small"
        aria-controls={open ? "color-scheme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        {...props}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            variant: "outlined",
            elevation: 0,
            sx: {
              my: "4px",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleMode("en")}>English</MenuItem>
        <MenuItem onClick={handleMode("ps")}>Pashto</MenuItem>
        <MenuItem onClick={handleMode("dr")}>Dari</MenuItem>
      </Menu>
    </Fragment>
  );
};

export default LanguageSwitcher;
