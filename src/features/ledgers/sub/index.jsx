import React from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../../theme/main/MainDashboard";
import SubLedgerForm from "./subLedger";
import { useSelector } from "react-redux";
import { getSelectedLedger } from "../../../store/selectors/ledgers.selector";

const SubLedger = () => {
  const selectedLedger = useSelector(getSelectedLedger);

  return (
    <MainDashboard title="Sub Ledger">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%", textAlign: "right" }}>
          {/* <NavLink to="/accounts/add">
            <Button variant="outlined">New Ledger</Button>
          </NavLink> */}
          <SubLedgerForm />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default SubLedger;
