import React from "react";
import MainDashboard from "../../theme/main/MainDashboard";
import { Grid2 as Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import EntryList from "./entryList";
import EntryForm from "./entryForm";

const JournalEntry = () => {
  const { t } = useTranslation();

  return (
    <MainDashboard title={t("JournalEntry")}>
      <Grid container spacing={2} columns={12} sx={{ width: "100%" }}>
        <Grid xs={12} lg={9} sx={{ width: "100%", height: "100%" }}>
          <EntryList />
          <EntryForm />
        </Grid>
      </Grid>
    </MainDashboard>
  );
};

export default JournalEntry;
