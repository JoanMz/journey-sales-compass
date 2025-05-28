import axios from "axios";
import { parseTransactionsResponse } from "./utils";

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
export const getTransactionsByStatus = async (status: "pending" | "rejected" | "approved" ) => {
  try {
    if (!status) {
      throw new Error("Status is required");
    }
    const response = await axios.post(
      "https://medium-server3.vercel.app/api",
      null,
      {
        headers: { "X-Target-Path": `/transactions/filter/${status}` },
      }
    );
    return  parseTransactionsResponse(response);
  } catch (error) {
    //console.error(`Failed to fetch ${status} transactions:`, error);
    console.log("Retrying transaction fetch due to error:", error);
    const response = await axios.post("/api", null, {
      headers: { "X-Target-Path": `/transactions/filter/${status}` },
    });
    console.log("Retry successful, response:", response.data);
    return  parseTransactionsResponse(response);
    // throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    /*  const response = await axios.post("/api", null, {
      headers: { "X-Target-Path": "/transactions" },
    }); */
    const response = await axios.post(
      "https://medium-server3.vercel.app/api",
      null,
      {
        headers: { "X-Target-Path": "/transactions" },
      }
    );
    return  parseTransactionsResponse(response);
  } catch (error) {
    console.error("Failed to fetch all transactions:", error);
    const response = await axios.post("/api", null, {
      headers: { "X-Target-Path": "/transactions" },
    });
    return  parseTransactionsResponse(response);
    // throw error; // Uncomment if you want to propagate the error
  }
};

export const getTransactionsByPeriod = async (
  period: "fortnight" | "month" | "all"
) => {
  try {
    const response = await axios.post(
      "/api",
      { data: { period } },
      {
        headers: { "X-Target-Path": "/transactions/date-range/" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch transactions for period ${period}:`, error);
    throw error;
  }
};

export const getTransactionsByMixedFilters = async (
  period: "fortnight" | "month" | "all",
  sellerId?: number,
  status?: "pending" | "rejected" | "approved" | null
) => {
  if (!period) {
    throw new Error("Period is required");
  }
  if (period === "all" && !sellerId && !status) return getAllTransactions();
  try {
    const response = await axios.post(
      "/api",
      { data: { period }, query: { seller_id: sellerId, status: status } },
      {
        headers: { "X-Target-Path": "/transactions/filter-mixed/" },
      }
    );
    return  parseTransactionsResponse(response);
  } catch (error) {
    console.error(`Failed to fetch transactions for period ${period}:`, error);
    throw error;
  }
};

export const updateTransactionStatus = async (id: number, status: string) => {
  try {
    const response = await axios.post("/api/", {
      url: `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000`,
      method: "PATCH",
      data: { status },
    });
    return  parseTransactionsResponse(response);
  } catch (error) {
    console.error(`Failed to update transaction ${id} status:`, error);
    throw error;
  }
};

export const generateDocuments = async (transactionId: number) => {
  try {
    const response = await axios.post(
      "/api",
      { transaction_id: transactionId },
      {
        headers: { "X-Target-Path": "/generate-documents" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to generate documents for transaction ${transactionId}:`,
      error
    );
    throw error;
  }
};

// get users
export const getUsers = async () => {
  try {
    const response = await axios.get("http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/users/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};


// create user
export const createUser = async (user: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone_number?: string;
}) => {
  try {
    const response = await axios.post(
      "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/users/",
      user
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

// delete user
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(
      `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

// update user using patch
export const updateUser = async (userId: string, user: {
  name: string;
  email: string;
  role: string;
}) => {
  try {
    const response = await axios.patch(
      `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/users/${userId}`,
      user
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

// !TODO: cambiar a los seller, get sellers (users with seller role)
export const getSellers = async () => {
  try {
    const response = await getUsers();
    // Filter users with role "seller" or "vendedor"
    const sellers = response.filter((user: any) => 
      user.role === "seller" || user.role === "vendedor"
    );
    return sellers;
  } catch (error) {
    console.error("Failed to fetch sellers:", error);
    throw error;
  }
};

export default api;
