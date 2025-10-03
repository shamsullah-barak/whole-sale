import axios from "axios";

export const fetchCashboxBalances = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/cashbox/balances`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
