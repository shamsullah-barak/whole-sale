import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";

// Fetch companies with pagination and filters
export const fetchCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

// Create a new company
export const createCompany = async (companyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/companies`, companyData);
    return response.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

// Get company by ID
export const getCompanyById = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching company:", error);
    throw error;
  }
};

// Update company
export const updateCompany = async (companyId, companyData) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/companies/${companyId}`,
      companyData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

// Delete company
export const deleteCompany = async (companyId) => {
  try {
    await axios.delete(`${API_BASE_URL}/companies/${companyId}`);
    return true;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

// Get all companies (for dropdowns)
export const getAllCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies?limit=1000`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all companies:", error);
    throw error;
  }
};
