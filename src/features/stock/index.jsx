import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";
import { selectDirection } from "../../store/selectors/app.selector";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { selectStocks } from "../../store/selectors/stock.selector";
import Model from "../../components/Model";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  addStockToList,
  fetchStocksAsync,
} from "../../store/slices/stock.slice";
// import StatCard from "../../components/StatCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function StatCard({ title, value, interval, trend, data, engName, _id }) {
  const theme = useTheme();
  const daysInWeek = getDaysInMonth(4, 2024);

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: "success",
    down: "error",
    neutral: "default",
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];
  const trendValues = { up: "+25%", down: "-25%", neutral: "+5%" };

  return (
    <NavLink to={_id}>
      <Card
        variant="outlined"
        sx={{
          cursor: "pointer",
          height: "100%",
          flexGrow: 1,
          transition: "transform 0.3s ease-in-out", // smooth animation
          "&:hover": {
            transform: "scale(1.05)", // increase size on hover
            boxShadow: 4, // optional: give a nice shadow
          },
        }}
      >
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Stack
            direction="column"
            sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
          >
            <Stack sx={{ justifyContent: "space-between" }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="h4" component="p">
                  {value}
                </Typography>
                <Chip size="small" color={color} label={trendValues[trend]} />
              </Stack>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {interval}
              </Typography>
            </Stack>
            <Box sx={{ width: "100%", height: 50 }}>
              <SparkLineChart
                colors={[chartColor]}
                data={data}
                area
                showHighlight
                showTooltip
                xAxis={{
                  scaleType: "band",
                  data: daysInWeek, // Use the correct property 'data' for xAxis
                }}
                sx={{
                  [`& .${areaElementClasses.root}`]: {
                    fill: `url(#area-gradient-${value})`,
                  },
                }}
              >
                <AreaGradient
                  color={chartColor}
                  id={`area-gradient-${value}`}
                />
              </SparkLineChart>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </NavLink>
  );
}

const StockList = () => {
  const stocks = useSelector(selectStocks).stocks;

  const data = {
    title: "Shop",
    value: "14k",
    trend: "up",
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340,
      380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {stocks.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              {...data}
              title={card.stockEngName}
              engName={card.stockEngName}
              value={card.productCount}
              _id={card._id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const CreateStock = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState({
    engName: "",
    psName: "",
    drName: "",
    location: "",
  });

  const selectedDirection = useSelector(selectDirection);
  const dispatch = useDispatch();

  // methods
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/stocks",
        stock,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // dispatch(fetchStocksAsync());
      dispatch(addStockToList({ stock: response.data }));
      toast.success("stock create");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ??
          "something went wrong please try again"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid
          xs={12}
          lg={9}
          sx={{
            width: "100%",
            textAlign: selectedDirection === "rtl" ? "left" : "right",
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
              color:
                theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
            })}
            onClick={() => setOpen(true)}
          >
            {t("newStock")}
          </Button>
        </Grid>
      </Grid>

      <Model
        open={open}
        handleClose={handleClose}
        submit="submit"
        cancel="cancel"
        loading={loading}
        disabled={loading}
        handleSubmit={handleSubmit}
      >
        <Typography variant="h6" mb={2}>
          Add new Stock
        </Typography>

        <Grid xs={12} spacing={2}>
          <Grid>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label={t("engName")}
                name="engName"
                type="text"
                value={stock.engName}
                onChange={(event) =>
                  setStock({
                    ...stock,
                    engName: event.target.value,
                  })
                }
                size="small"
              />
              <TextField
                fullWidth
                label={t("psName")}
                name="psName"
                type="text"
                required
                size="small"
                value={stock.psName}
                onChange={(event) =>
                  setStock({
                    ...stock,
                    psName: event.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                required
                size="small"
                label={t("drName")}
                name="drName"
                type="text"
                value={stock.drName}
                onChange={(event) =>
                  setStock({
                    ...stock,
                    drName: event.target.value,
                  })
                }
              />
            </Box>
          </Grid>
          <Grid container xs={12} spacing={2} mt={2}>
            <TextField
              fullWidth
              label={t("location")}
              name="location"
              type="text"
              value={stock.location}
              onChange={(event) =>
                setStock({
                  ...stock,
                  location: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      </Model>
    </>
  );
};

const Stock = () => {
  return (
    <>
      <>
        <CreateStock />
        <StockList />
      </>
    </>
  );
};

export default Stock;
