import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchStocks = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/stocks`);
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

// A mock function to mimic making an async request for data
export const fetchStockNames = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/stocks/stock-names`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

// Delete stock
export const deleteStock = async (stockId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/stocks/${stockId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
