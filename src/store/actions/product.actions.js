import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Fetch products with pagination and filters
export const fetchProducts = async (page, limit, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await axios.get(`${API_BASE_URL}/products?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_BASE_URL}/products/${productId}`);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Fetch companies (for dropdowns)
export const fetchCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/company?limit=1000`);
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// Fetch categories (for dropdowns)
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories?limit=1000`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
