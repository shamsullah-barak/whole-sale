import axios from "axios";

// Fetch all sales with pagination
export const fetchSales = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/sales?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Fetch single sale by ID
export const fetchSaleById = async (saleId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/sales/${saleId}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Create new sale
export const createSale = async (saleData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/sales`,
      saleData
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Update existing sale
export const updateSale = async (saleId, saleData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/sales/${saleId}`,
      saleData
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Delete sale
export const deleteSale = async (saleId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/sales/${saleId}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Fetch next sale number
export const fetchNextSaleNumber = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/sales/next-sale`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
