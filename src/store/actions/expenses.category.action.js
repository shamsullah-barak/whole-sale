import axios from "axios";

// Fetch all expense categories
export const fetchExpenseCategories = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/expense-categories`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
