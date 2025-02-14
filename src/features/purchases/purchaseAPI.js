import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchPurchases = async (page, limit) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/purchases?page=${page}&limit=${limit}`
    );
    console.log({ res: response.data });
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
