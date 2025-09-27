import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Fetch subLedgers for a specific ledger
export const fetchSubLedgers = async (ledgerId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ledgers/${ledgerId}/sub-ledgers`,
      {
        params: { page, limit },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch subLedgers"
    );
  }
};

// Create a new subLedger
export const createSubLedger = async (ledgerId, subLedgerData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sub-ledgers`,
      {
        ...subLedgerData,
        ledgerId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to create subLedger"
    );
  }
};

// Update an existing subLedger
export const updateSubLedger = async (subLedgerId, subLedgerData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/sub-ledgers/${subLedgerId}`,
      subLedgerData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to update subLedger"
    );
  }
};

// Delete a subLedger
export const deleteSubLedger = async (subLedgerId) => {
  try {
    await axios.delete(`${API_BASE_URL}/sub-ledgers/${subLedgerId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return subLedgerId;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete subLedger"
    );
  }
};

