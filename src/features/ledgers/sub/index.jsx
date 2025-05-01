import React from "react";
import Grid from "@mui/material/Grid2";
import MainDashboard from "../../../theme/main/MainDashboard";
import SubAccountForm from "./subAccount";
import { useSelector } from "react-redux";
import { getSelectedLedger } from "../../../store/selectors/ledgers.selector";

const SubAccount = () => {
  const selectedAccount = useSelector(getSelectedLedger);

  return (
    <MainDashboard title="Sub Account">
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid item xs={12} lg={9} sx={{ width: "100%", textAlign: "right" }}>
          {/* <NavLink to="/accounts/add">
            <Button variant="outlined">New Account</Button>
          </NavLink> */}
          <SubAccountForm />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default SubAccount;
