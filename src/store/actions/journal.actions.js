import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchJournals = async (page, limit) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/journalEntries?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
