import axios from "axios";

// Fetch all expenses with pagination
export const fetchExpenses = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/expenses?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Fetch single expense by ID
export const fetchExpenseById = async (expenseId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/expenses/${expenseId}`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Create new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/expenses`,
      expenseData
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Update existing expense
export const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/expenses/${expenseId}`,
      expenseData
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (expenseId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/expenses/${expenseId}`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

// Fetch next expense number
export const fetchNextExpenseNumber = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/expenses/next-expense`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
