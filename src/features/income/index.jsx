import React from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { selectIncomes } from "../../store/selectors/incomes.selector";
import Datagrid from "../../components/DataGrid";

const IncomesList = () => {
  const { t } = useTranslation();

  const incomes = useSelector(selectIncomes);

  const stateChanged = (data) => {};

  const columns = [
    {
      field: "totalAmount",
      headerName: "Amount",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "amountPerProduct",
      headerName: "Amount Per Unit",
      flex: 0.5,
      minWidth: 80,
    },
  ];

  return (
    <>
      <ToastContainer />
      {incomes?.incomes?.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          {t("No Data found")}
        </div>
      ) : (
        <>
          <Datagrid
            rows={incomes?.incomes}
            columns={columns}
            limitPerPage={incomes?.limitPerPage}
            loading={incomes?.loading}
            totalRows={incomes?.totalRows}
            currentPage={incomes?.currentPage}
            stateChanged={stateChanged}
          />
        </>
      )}
    </>
  );
};

const Incomes = () => {
  const { t } = useTranslation();

  return (
    <MainDashboard title={t("incomes")}>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%" }}>
          <IncomesList />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default Incomes;
