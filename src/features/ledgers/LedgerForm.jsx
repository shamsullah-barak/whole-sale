import React, { useState } from "react";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import COLORS from "../../constant/colors";

const LedgerForm = () => {
  const { t } = useTranslation();
  const [ledger, setLedger] = useState({
    name: "",
    district: "",
    ledgerType: "paid",
    phoneNumber: "",
    whatsAppNumber: "",
    province: "",
  });

  // ledger handler
  const createLedgerHandler = async (event) => {
    event.preventDefault(event);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ledgers",
        ledger,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLedger({
        name: "",
        province: "",
        district: "",
        ledgerType: "",
        phoneNumber: "",
        whatsAppNumber: "",
        province: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={ledger.name}
            onChange={(event) =>
              setLedger({ ...ledger, name: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="province"
            name="province"
            type="text"
            value={ledger.province}
            onChange={(event) =>
              setLedger({
                ...ledger,
                province: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="district"
            name="district"
            type="text"
            value={ledger.district}
            onChange={(event) =>
              setLedger({ ...ledger, district: event.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Ledger Type"
            name="ledgerType"
            value={ledger.ledgerType}
            onChange={(event) =>
              setLedger({ ...ledger, ledgerType: event.target.value })
            }
          >
            <MenuItem value="afghani">Afghani</MenuItem>
            <MenuItem value="dollar">Dollar</MenuItem>
            <MenuItem value="rupee">Rupee</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={ledger.phoneNumber}
            onChange={(event) =>
              setLedger({ ...ledger, phoneNumber: event.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="whatsAppNumber "
            name="whatsAppNumber"
            value={ledger.whatsAppNumber}
            onChange={(event) =>
              setLedger({ ...ledger, whatsAppNumber: event.target.value })
            }
          />
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("amount")}
            name="amount"
            type="number"
            value={ledger.amount}
            onChange={(event) =>
              setLedger({ ...ledger, amount: event.target.value })
            }
          />
        </Grid> */}
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="inherit"
        fullWidth
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? COLORS.WHITE : COLORS.PURPLE,
          color: theme.palette.mode === "dark" ? COLORS.BLACK : COLORS.WHITE,
        })}
        style={{ marginTop: 20 }}
        onClick={createLedgerHandler}
      >
        {t("Create Ledger")}
      </Button>
    </form>
  );
};

export default LedgerForm;
