import React, { useState } from "react";
import MainDashboard from "../../../theme/main/MainDashboard";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectPartners } from "../../../store/selectors/investment.selector";
import Button from "@mui/material/Button";
import { Typography, TextField, Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { selectDirection } from "../../../store/selectors/app.selector";
import COLORS from "../../../constant/colors";
import { BarChart } from "@mui/x-charts";
import Model from "../../../components/Model";

const types = ["deposit", "withdraw"];

const dataset = [
  {
    total_invest: 59,
    income: 57,
    expense: 86,
    asset: 21,
    month: "Jan",
  },
  {
    total_invest: 50,
    income: 52,
    expense: 78,
    asset: 28,
    month: "Feb",
  },
  {
    total_invest: 47,
    income: 53,
    expense: 106,
    asset: 41,
    month: "Mar",
  },
  {
    total_invest: 54,
    income: 56,
    expense: 92,
    asset: 73,
    month: "Apr",
  },
  {
    total_invest: 57,
    income: 69,
    expense: 92,
    asset: 99,
    month: "May",
  },
  {
    total_invest: 60,
    income: 63,
    expense: 103,
    asset: 144,
    month: "June",
  },
  {
    total_invest: 59,
    income: 60,
    expense: 105,
    asset: 319,
    month: "July",
  },
  {
    total_invest: 65,
    income: 60,
    expense: 106,
    asset: 249,
    month: "Aug",
  },
  {
    total_invest: 51,
    income: 51,
    expense: 95,
    asset: 131,
    month: "Sept",
  },
  {
    total_invest: 60,
    income: 65,
    expense: 97,
    asset: 55,
    month: "Oct",
  },
  {
    total_invest: 67,
    income: 64,
    expense: 76,
    asset: 48,
    month: "Nov",
  },
  {
    total_invest: 61,
    income: 70,
    expense: 103,
    asset: 25,
    month: "Dec",
  },
];

function valueFormatter(value) {
  return `${value}mm`;
}

const chartSetting = {
  yAxis: [
    {
      label: "investment (mm)",
      width: 60,
    },
  ],
  height: 300,
};

function BasicLineChart() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: "month", scaleType: "band" }]}
      series={[
        { dataKey: "total_invest", label: "total invest", valueFormatter },
        { dataKey: "income", label: "income", valueFormatter },
        { dataKey: "expense", label: "expense", valueFormatter },
        { dataKey: "asset", label: "asset", valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}

const AddNewInvest = () => {
  const { t } = useTranslation();
  const selectedDirection = useSelector(selectDirection);
  const partners = useSelector(selectPartners);

  const [open, setOpen] = useState(false);
  const [newInvest, setNewInvest] = useState({
    amount: "",
    investorId: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  const handleNewInvest = async (event) => {
    event.preventDefault(event);

    if (newInvest.type === "deposit") {
      try {
        setLoading(true);
        await axios.post(
          `http://localhost:5000/api/investments/deposit`,
          newInvest,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setOpen(false);
        setLoading(false);
        toast.success("data added");
      } catch (error) {
        setOpen(false);
        setLoading(false);
        setNewInvest({ amount: "", investorId: "", type: "" });
        toast.error(
          error?.response.data.message ??
            "something went wrong! please try again"
        );
      }
    } else if (newInvest.type === "withdraw") {
      try {
        setLoading(true);
        await axios.post(
          `http://localhost:5000/api/investments/withdraw`,
          newInvest,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setOpen(false);
        setLoading(false);
        toast.success("data added");
      } catch (error) {
        setOpen(false);
        setLoading(false);
        setNewInvest({ amount: "", investorId: "", type: "" });
        toast.error(
          error?.response.data.message ??
            "something went wrong! please try again"
        );
      }
    }
  };

  const handleCLose = () => {
    setOpen(false);
  };

  return (
    <>
      <ToastContainer />

      <Model
        open={open}
        handleClose={handleCLose}
        submit="submit"
        cancel="cancel"
        loading={loading}
        disabled={loading}
        handleSubmit={handleNewInvest}
      >
        <Typography variant="h6" mb={2}>
          Add new invest
        </Typography>

        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            label={t("type")}
            name="type"
            value={newInvest.type}
            onChange={(event) =>
              setNewInvest({ ...newInvest, type: event.target.value })
            }
          >
            {types.map((item) => (
              <MenuItem key={item} value={item} dir={selectedDirection}>
                {t(`${item}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="amount"
            name="amount"
            value={newInvest.amount}
            onChange={(event) =>
              setNewInvest({ ...newInvest, amount: event.target.value })
            }
            fullWidth
            size="small"
            type="number"
          />

          <TextField
            select
            fullWidth
            label={t("investorId")}
            name="investorId"
            value={newInvest.investorId}
            onChange={(event) =>
              setNewInvest({ ...newInvest, investorId: event.target.value })
            }
          >
            {partners.map((item) => (
              <MenuItem key={item.id} value={item._id} dir={selectedDirection}>
                {t(`${item.name}`)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Model>

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
            {t("addInvest")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          {/* <Typography>Total investment : 1000$</Typography>
          <Typography>Current investment : 1000$</Typography> */}
          <BasicLineChart />
        </Grid>
      </Grid>
    </>
  );
};

const AddInvest = () => {
  const { t } = useTranslation();
  return (
    <MainDashboard title={t("AddInvest")}>
      <AddNewInvest />
    </MainDashboard>
  );
};

export default AddInvest;
