import axios from "axios";

// Fetch all installments
export const fetchInstallments = async (page = 1, limit = 10, type = null) => {
  try {
    const url = type 
      ? `http://localhost:5000/api/installments?page=${page}&limit=${limit}&type=${type}`
      : `http://localhost:5000/api/installments?page=${page}&limit=${limit}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Fetch single installment by ID
export const fetchInstallmentById = async (installmentId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/installments/${installmentId}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Create new installment
export const createInstallment = async (installmentData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/installments`,
      installmentData
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Update existing installment
export const updateInstallment = async (installmentId, installmentData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/installments/${installmentId}`,
      installmentData
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Delete installment
export const deleteInstallment = async (installmentId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/installments/${installmentId}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Fetch loans for installment selection
export const fetchLoans = async (type = null) => {
  try {
    const url = type 
      ? `http://localhost:5000/api/loans?type=${type}`
      : `http://localhost:5000/api/loans`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Fetch installment history for a specific loan
export const fetchInstallmentHistory = async (loanId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/installments/loan/${loanId}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
