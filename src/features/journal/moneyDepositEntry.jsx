import React, { useState } from "react";
import axios from "axios";
import { TextField, MenuItem, Button, Grid2 as Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";
import { useTranslation } from "react-i18next";
import { selectLedgers } from "../../store/selectors/ledgers.selector";
import { selectDirection } from "../../store/selectors/app.selector";
import COLORS from "../../constant/colors";
import { toast, ToastContainer } from "react-toastify";

const MoneyDeposit = ({ statusId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const journals = useSelector(selectJournals);
  const ledgers = useSelector(selectLedgers);
  const selectedDirection = useSelector(selectDirection);

  const journalEntryHandler = async (event) => {
    event.preventDefault(event);
    try {
      await axios.post(
        `http://localhost:5000/api/journal-entries/money-deposit`,
        journalEntry,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
      setJournalEntry({
        description: "",
        amount: 0,
      });

      toast.success("data successfully added");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "something went wrong! please try again"
      );
    }
  };

  const [journalEntry, setJournalEntry] = useState({
    description: "",
    amount: 0,
    ledgerId: "",
    ledgerInfo: "",
  });

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} sx={{ marginTop: "15px" }}>
        <Grid size={12} xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label={t("select ledger")}
            sx={{ width: "100%" }}
            dir={selectedDirection === "rtl" ? "right" : "left"}
            value={journalEntry.ledgerId}
            onChange={(event) => {
              const selectedLedger = ledgers.ledgers.find(
                (ledger) => ledger._id === event.target.value
              );
              setJournalEntry({
                ...journalEntry,
                ledgerId: selectedLedger._id,
                ledgerInfo: selectedLedger.name,
              });
            }}
          >
            {ledgers.ledgers?.map((item, index) => (
              <MenuItem key={index} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={12} xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label={t("Quantity")}
            name="amount"
            type="number"
            value={journalEntry.amount}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                amount: event.target.value,
              })
            }
          />
        </Grid>
        <Grid size={12} xs={12} sm={12} md={4}>
          <TextField
            fullWidth
            label={t("description")}
            name="description"
            type="text"
            value={journalEntry.description}
            onChange={(event) =>
              setJournalEntry({
                ...journalEntry,
                description: event.target.value,
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
        onClick={journalEntryHandler}
      >
        {t("Add")}
      </Button>
    </>
  );
};

export default MoneyDeposit;
