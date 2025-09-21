import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HighlightedCard from "./HighlightedCard";
import SalesGraph from "./SalesGraph";
import SessionsChart from "./SessionsChart";
import StatCard from "./StatCard";
import { useDispatch, useSelector } from "react-redux";
import { dashboardDataAsync } from "../store/slices/dashboard.slice";
import { selectDashboardData } from "../store/selectors/dashboard.selector";

export default function MainGrid() {
  const data = useSelector(selectDashboardData).cards;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dashboardDataAsync());
  }, []);
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid> */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SalesGraph />
        </Grid>
      </Grid>
    </Box>
  );
}
