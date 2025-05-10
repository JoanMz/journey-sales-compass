
import axios from "axios";

// Base URL for API calls through our Edge Function
const API_BASE_URL = "/api/proxy";

// Create API service with consistent error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for logging and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return Promise.reject(error);
  }
);

// Transaction API functions
export const getTransactions = async (status: string) => {
  try {
    const response = await api.get(`/transactions/filter/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${status} transactions:`, error);
    throw error;
  }
};

export const updateTransactionStatus = async (id: number, status: string) => {
  try {
    const response = await api.patch(`/transactions/${id}/status?status=${status}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to update transaction ${id} status:`, error);
    throw error;
  }
};

export const generateDocuments = async (transactionId: number) => {
  try {
    const response = await api.post(`/generate-documents`, { 
      transaction_id: transactionId 
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to generate documents for transaction ${transactionId}:`, error);
    throw error;
  }
};

export default api;
