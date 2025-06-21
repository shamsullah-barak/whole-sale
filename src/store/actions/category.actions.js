import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Fetch categories with pagination and filters
export const fetchCategories = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await axios.get(`${API_BASE_URL}/categories?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Get all categories (for dropdowns)
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories?limit=1000`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
};
