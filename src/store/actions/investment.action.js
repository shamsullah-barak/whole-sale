import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchPartners = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/investments/partners`
    );
    console.log({ res: response.data });
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

// A mock function to mimic making an async request for data
export const fetchCashBox = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/ledgers/cashBox`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
