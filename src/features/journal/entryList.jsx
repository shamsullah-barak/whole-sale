import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJournalsAsync } from "../../store/slices/journal.slice";
import { selectJournals } from "../../store/selectors/journal.selector";
import { useTranslation } from "react-i18next";
import Datagrid from "../../components/DataGrid";

const columns = [
  {
    field: "status",
    headerName: "status",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "amount",
    headerName: "amount",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "description",
    headerName: "description",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "date",
    headerName: "date",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 80,
  },
];

const EntryList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const journals = useSelector(selectJournals);

  useEffect(() => {
    const loadProducts = () => {
      // dispatch(fetchAccountsAsync({ page: 1, limit: journals?.limitPerPage }));
      dispatch(fetchJournalsAsync({ page: 1, limit: journals?.limitPerPage }));
    };
    loadProducts();
  }, []);

  const stateChanged = (data) => {
    const { page, pageSize } = data;
    dispatch(fetchJournalsAsync({ page: page + 1, limit: pageSize }));
  };

  return (
    <>
      {journals.journals.length === 0 ? (
        <>
          <div
            style={{
              textAlign: "center",
              marginTop: "50px",
              marginBottom: "50px",
            }}
          >
            {t("No Data found")}
          </div>
        </>
      ) : (
        <>
          <Datagrid
            rows={journals?.journals}
            columns={columns}
            limitPerPage={journals?.limitPerPage}
            loading={journals?.loading}
            totalRows={journals?.totalRows}
            currentPage={journals?.currentPage}
            stateChanged={stateChanged}
          />
        </>
      )}
    </>
  );
};

export default EntryList;
