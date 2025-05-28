import Grid from "@mui/material/Grid2";
import MainDashboard from "../../theme/main/MainDashboard";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { selectDirection } from "../../store/selectors/app.selector";
import { useSelector } from "react-redux";

const Stock = () => {
  const selectedDirection = useSelector(selectDirection);
  const { t } = useTranslation();
  return (
    <MainDashboard title="Stock">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{
            width: "100%",
            textAlign: selectedDirection === "rtl" ? "left" : "right",
          }}
        >
          <NavLink to="/stocks/create">
            <Button
              variant="contained"
              color="inherit"
              sx={(theme) => ({
                backgroundColor:
                  theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
                color:
                  theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
              })}
            >
              {t("New Stock")}
            </Button>
          </NavLink>
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Stock;
