import React, { useState } from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import COLORS from "../../constant/colors";
import { Save } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectDirection } from "../../store/selectors/app.selector";
import { selectPartners } from "../../store/selectors/investment.selector";
import axios from "axios";
import { fetchPartnersAsync } from "../../store/slices/investment.slice";

const columns = [
  {
    field: "name",
    headerName: "name",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "location",
    headerName: "location",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const investors = [
  { id: 1, name: "احمد" },
  { id: 2, name: "فرید" },
  { id: 3, name: "ذبیح" },
];

const paymentMethods = ["نقد", "بانک", "انتقال"];

function NewInvestmentForm() {
  const [form, setForm] = useState({
    investorId: "",
    amount: "",
    method: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // دلته کولی شي API call یا submit logic وشي
    console.log("Submitted Investment:", form);
    alert("سرمایه ثبت شوه!");
    // Clear form
    setForm({
      investorId: "",
      amount: "",
      method: "",
      date: "",
      description: "",
    });
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 600, mx: "auto" }}
      >
        <Typography variant="h6" gutterBottom>
          📥 د نوې سرمایه ثبت
        </Typography>

        <Stack spacing={2}>
          {/* شریک انتخاب */}
          <FormControl fullWidth required>
            <InputLabel>شریک انتخاب کړئ</InputLabel>
            <Select
              name="investorId"
              value={form.investorId}
              label="شریک انتخاب کړئ"
              onChange={handleChange}
            >
              {investors.map((inv) => (
                <MenuItem key={inv.id} value={inv.id}>
                  {inv.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="amount"
            label="د سرمایه مقدار"
            type="number"
            fullWidth
            required
            value={form.amount}
            onChange={handleChange}
          />

          <FormControl fullWidth required>
            <InputLabel>د ورکړې طریقه</InputLabel>
            <Select
              name="method"
              value={form.method}
              label="د ورکړې طریقه"
              onChange={handleChange}
            >
              {paymentMethods.map((m, i) => (
                <MenuItem key={i} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="date"
            label="د سرمایه نیټه"
            type="date"
            fullWidth
            required
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* توضیحات */}
          <TextField
            name="description"
            label="یادښت یا توضیحات"
            multiline
            rows={3}
            fullWidth
            value={form.description}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Save />}
          >
            ثبت کړئ
          </Button>
        </Stack>
      </Box>
    </>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const currencyTypes = ["afn", "dollar", "rupee"];

const Partners = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedDirection = useSelector(selectDirection);
  const partners = useSelector(selectPartners);

  console.log({ partners });

  const [partner, setPartner] = useState({
    name: "",
    location: "",
    currencyType: "",
  });

  const stateChanged = (data) => {
    const { page, pageSize } = data;
  };
  const submitHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/investments/partners",
        partner,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === "201") {
        dispatch(fetchPartnersAsync());
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ?? "something went wrong, try again"
      );
    }
  };

  const handleRowClick = (params) => {
    // dispatch(setSelectedAccount({ account: params.row }));
    // navigate(`/ledgers/${params.row.id}`);
  };

  return (
    <>
      <>
        {partners.length === 0 ? (
          <>
            <p
              style={{
                textAlign: "center",
                marginTop: "50px",
                marginBottom: "50px",
              }}
            >
              {t("No Data found")}
            </p>
          </>
        ) : (
          <>
            <DataGrid
              rows={partners || []}
              columns={columns}
              getRowId={(row) => row.id}
              onRowClick={handleRowClick}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              initialState={{
                pagination: {
                  paginationModel: { pageSize: partners?.limitPerPage },
                },
              }}
              pageSizeOptions={[10, 20, 50]}
              onPaginationModelChange={(data) => stateChanged(data)}
              disableColumnResize
              rowCount={partners?.totalRows}
              paginationMode="server"
              pagination
              page={partners?.currentPage}
              pageSize={partners?.limitPerPage}
              loading={partners?.loading}
              density="compact"
              slotProps={{
                filterPanel: {
                  filterFormProps: {
                    logicOperatorInputProps: {
                      variant: "outlined",
                      size: "small",
                    },
                    columnInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    operatorInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    valueInputProps: {
                      InputComponentProps: {
                        variant: "outlined",
                        size: "small",
                      },
                    },
                  },
                },
              }}
            />
          </>
        )}
      </>

      <ToastContainer />
      <form style={{ marginTop: "15px" }}>
        <Grid container>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("name")}
              name="name"
              style={{ minWidth: "200px" }}
              dir={selectedDirection === "rtl" ? "right" : "left"}
              value={partner.name}
              onChange={(event) => {
                setPartner({ ...partner, name: event.target.value });
              }}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label={t("currencyType")}
              name="currencyType"
              value={partner.currencyType} // default empty string if null
              onChange={(event) => {
                setPartner({
                  ...partner,
                  currencyType: event.target.value,
                });
              }}
              style={{ minWidth: "200px" }}
            >
              {currencyTypes.map((item) => (
                <MenuItem key={item} value={item} dir={selectedDirection}>
                  {t(`${item}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("location")}
              name="location"
              type="location"
              value={partner.location}
              onChange={(event) =>
                setPartner({
                  ...partner,
                  location: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="inherit"
          style={{ marginTop: 20 }}
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
            color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
          })}
          onClick={submitHandler}
        >
          {t("Add")}
        </Button>
      </form>
    </>
  );
};

function InvestmentTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor={COLORS.PURPLE}
        // textColor="primary"
        sx={{
          borderBottom: 1,
          borderColor: COLORS.PURPLE,
          //   "& .MuiTab-root": {
          //     fontWeight: "bold",
          //     fontSize: "1rem",
          //     textTransform: "none",
          //   },
        }}
      >
        {" "}
        <Tab label="نوې سرمایه" />
        <Tab label="تاریخچه" />
        <Tab label="قسطونه" />
        <Tab label="سرمایه ایستل" />
        <Tab label="راپورونه" />
        <Tab label="شریکان" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <NewInvestmentForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        📊 دلته د تاریخچې جدول
      </TabPanel>
      <TabPanel value={value} index={2}>
        🔁 دلته د قسطونو لیست
      </TabPanel>
      <TabPanel value={value} index={3}>
        📤 دلته د سرمایه ایستل فورم
      </TabPanel>
      <TabPanel value={value} index={4}>
        📈 دلته د راپورونو چارټونه
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Partners />
      </TabPanel>
    </>
  );
}

const Investments = () => {
  const { t } = useTranslation();

  return (
    <MainDashboard title={t("Investments")}>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", height: "100%" }}>
          <InvestmentTabs />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Investments;
