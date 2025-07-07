import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchUnits = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/units`, { params: { companyId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
