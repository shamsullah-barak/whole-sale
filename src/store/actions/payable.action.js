import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchPayable = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/ledgers/payable`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
