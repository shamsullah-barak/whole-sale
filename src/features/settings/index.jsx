import React from "react";
import { Typography, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFontFamily,
  selectFontOptions,
} from "../../store/selectors/app.selector";
import { changeFontFamily } from "../../store/slices/app.slice";

const FontChanger = () => {
  const fontFamily = useSelector(selectFontFamily);
  const fontOptions = useSelector(selectFontOptions);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(changeFontFamily({ fontFamily: event.target.value }));
  };

  return (
    <>
      <Typography>فونټ انتخاب کړئ</Typography>
      <Select value={fontFamily} onChange={handleChange}>
        {fontOptions.map((font) => (
          <MenuItem key={font.value} value={font.value}>
            {font.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

const Settings = () => {
  return (
    <>
      <FontChanger />
    </>
  );
};

export default Settings;
