import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchIncome = async (page, limit) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/incomes`);
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
