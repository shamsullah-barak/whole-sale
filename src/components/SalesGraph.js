import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { Box, FormControl, Select, MenuItem } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { selectDashboardData } from "../store/selectors/dashboard.selector";

function SalesCard({ fetchUrl = null }) {
  const theme = useTheme();
  const data = useSelector(selectDashboardData).salesGraph;

  const BLUE = "#2d6cdf";
  const GREEN = "#2dd4bf";

  const tooltipFormatter = (value, name) => {
    if (name && name.toLowerCase().includes("revenue")) {
      return [value + " AFN", name];
    }
    return [value, name];
  };

  // custom legend renderer for margin + rounded dots
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        gap={2}
        mb={1}
        ml={1}
      >
        {payload.map((entry, index) => (
          <Box
            key={`item-${index}`}
            display="flex"
            alignItems="baseline"
            gap={0.6}
            justifyContent="center"
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: entry.color,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%", height: 290 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.data}
          margin={{ top: 18, right: 18, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            stroke={theme.palette.divider}
            strokeDasharray="1 1"
            strokeWidth={0.4}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          />
          <Tooltip
            formatter={tooltipFormatter}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 8,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[3],
              padding: "8px 12px",
            }}
            cursor={{ fill: theme.palette.action.hover }}
          />
          <Legend content={renderLegend} />
          <Bar
            dataKey="sales"
            name="Sales"
            stackId="a"
            radius={[0, 0, 0, 0]}
            barSize={5}
            fill={BLUE}
            stroke={BLUE}
            strokeWidth={0.5}
          />
          <Bar
            dataKey="revenue"
            name="Revenue"
            stackId="a"
            radius={[6, 6, 0, 0]}
            barSize={5}
            fill={GREEN}
            stroke={GREEN}
            strokeWidth={0.5}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default function PageViewsBarChart() {
  const data = useSelector(selectDashboardData).salesGraph;

  console.log({ data });
  const [range, setRange] = useState("thisWeek");
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        {/* <Typography component="h2" variant="subtitle2" gutterBottom>
          Page views and downloads
        </Typography> */}
        <Stack
          sx={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {data.title} {data.value}
            </Typography>
            {/* <Chip size="small" color="error" label="-8%" /> */}
          </Stack>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={range} onChange={(e) => setRange(e.target.value)}>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <SalesCard />
      </CardContent>
    </Card>
  );
}
