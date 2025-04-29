import * as React from "react";
import MainDashboard from "../theme/main/MainDashboard";
import { useTranslation } from "react-i18next";

const Customers = () => {
  const { t, i18n } = useTranslation();
  return (
    <MainDashboard>
      <div>{t("Customers")}</div>
      <button
        onClick={() => {
          i18n.changeLanguage("ps");
        }}
      >
        PS
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage("en");
        }}
      >
        EN
      </button>
      <button
        onClick={() => {
          i18n.changeLanguage("dr");
        }}
      >
        DR
      </button>
    </MainDashboard>
  );
};

export default Customers;
