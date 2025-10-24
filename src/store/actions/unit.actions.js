import axios from "axios";

export const fetchUnits = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/units`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
