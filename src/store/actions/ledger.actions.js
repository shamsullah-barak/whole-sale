import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchLedgers = async (page, limit) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/ledgers?page=${page}&limit=${limit}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

export const createLedger = async (ledgerData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/ledgers`,
      ledgerData
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};