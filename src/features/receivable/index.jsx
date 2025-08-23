import React from "react";
import { useSelector } from "react-redux";
import MainDashboard from "../../theme/main/MainDashboard";
import { useTranslation } from "react-i18next";
import { selectReceivables } from "../../store/selectors/receivable.selector";
import Datagrid from "../../components/DataGrid";

const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "address",
    headerName: "address",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "amount",
    headerName: "Total Amount",
    flex: 0.5,
    minWidth: 80,
  },
];

const ReceivableList = () => {
  const { t } = useTranslation();

  const receivables = useSelector(selectReceivables);

  const stateChanged = (data) => {};

  return (
    <>
      {receivables.receivables.length === 0 ? (
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
        <div style={{ width: "100%" }}>
          <Datagrid
            rows={receivables?.receivables}
            columns={columns}
            limitPerPage={receivables?.limitPerPage}
            loading={receivables?.loading}
            totalRows={receivables?.totalRows}
            currentPage={receivables?.currentPage}
            stateChanged={stateChanged}
          />
        </div>
      )}
    </>
  );
};

const Receivable = () => {
  return (
    <>
      <MainDashboard title="Receivable">
        <ReceivableList />
      </MainDashboard>
    </>
  );
};

export default Receivable;
