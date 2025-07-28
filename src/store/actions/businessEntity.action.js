import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchSuppliers = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/businessEntities?type=supplier`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};

// A mock function to mimic making an async request for data
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/businessEntities?type=customer`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
