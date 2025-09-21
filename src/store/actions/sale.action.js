import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchSales = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/sales`);
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

// A mock function to mimic making an async request for data
export const fetchNextSaleNumber = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/sales/next-sale`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
