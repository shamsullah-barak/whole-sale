import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchPurchases = async (page, limit) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/purchases?page=${page}&limit=${limit}`
    );

    let totalCashPurchases = 0;
    let totalCreditPurchases = 0;
    let totalCashAndCreditPurchases = 0;
    let totalPurchases = 0;

    response.data.results.forEach((item) => {
      const price = Number(item.totalPrice);
      totalPurchases += price;

      switch (item.paymentMethod) {
        case "cash":
          totalCashPurchases += price;
          break;
        case "credit":
          totalCreditPurchases += price;
          break;
        case "cashAndCredit":
          totalCashAndCreditPurchases += price;
          break;
      }
    });

    return {
      ...response.data,
      totalCashAndCreditPurchases,
      totalCreditPurchases,
      totalPurchases,
      totalCashPurchases,
    };
  } catch (error) {
    console.log({ error });
  }
};

// A mock function to mimic making an async request for data
export const fetchNextInvoiceNo = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/purchases/next-invoice`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

// A mock function to mimic making an async request for data
export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/purchases/dashboard`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

// Create a purchase
export const createPurchase = async (data) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/purchases`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Get purchase by id
export const getPurchaseById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/purchases/${id}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Update purchase
export const updatePurchase = async (id, data) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/purchases/${id}`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Delete purchase
export const deletePurchase = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/purchases/${id}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};