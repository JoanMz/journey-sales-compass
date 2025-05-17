
import axios from "axios";

// Create API service with consistent error handling
const api = axios.create({
  baseURL: "/api",
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

// Transaction API functions with the new approach
export const getTransactions = async (status: string) => {
  try {
    const response = await axios.post("/api/", {
      url: `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/transactions/filter/${status}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${status} transactions:`, error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await axios.post("/api/", {
      url: "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/transactions/",
      method: "GET"
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all transactions:", error);
    throw error;
  }
};

export const getTransactionsByPeriod = async (period: string) => {
  try {
    // Using the existing endpoint and filtering on the frontend
    const response = await axios.post("/api/", {
      url: "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/transactions/filter/approved",
      method: "GET"
    });
    const transactions = response.data;
    
    // Filter transactions by period will happen in the component
    return transactions;
  } catch (error) {
    console.error(`Failed to fetch transactions for period ${period}:`, error);
    throw error;
  }
};

export const updateTransactionStatus = async (id: number, status: string) => {
  try {
    const response = await axios.post("/api/", {
      url: `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/transactions/${id}/status`,
      method: "PATCH",
      data: { status }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update transaction ${id} status:`, error);
    throw error;
  }
};

export const generateDocuments = async (transactionId: number) => {
  try {
    const response = await axios.post("/api/", {
      url: "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/generate-documents",
      method: "POST",
      data: { transaction_id: transactionId }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to generate documents for transaction ${transactionId}:`, error);
    throw error;
  }
};

export default api;
