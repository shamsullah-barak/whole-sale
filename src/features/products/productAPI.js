import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/products");
    console.log({ d: response.data });
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
