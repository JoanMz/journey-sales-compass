import axios from "axios";
import { parseTransactionsResponse } from "./utils";
import { Transaction, FlightInfo, HotelInfo, AccountData, TotalIncomeMetrics, MonthlyIncomeResponse, CommissionsByUserResponse } from "@/types/transactions";
import { endpoints } from "./endpoints";

// Define API response type
export interface ApiResponse {
  data?: Transaction | Transaction[];
  status?: number;
  message?: string;
}

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
export const getTransactionsByStatus = async (
  status: "pending" | "rejected" | "approved" | "terminado"
) => {
  try {
    if (!status) {
      throw new Error("Status is required");
    }
    const response = await axios.post(
      // "https://medium-server3.vercel.app/transactions",
      "/api/transactions3",
      null,
      {
        headers: { "X-Target-Path": `/transactions/filter/${status}` },
      }
    );
    return parseTransactionsResponse(response);
  } catch (error) {
    //console.error(`Failed to fetch ${status} transactions:`, error);
    console.log("Retrying transaction fetch due to error:", error);
    const response = await axios.post("/api/transactions4", null, {
      headers: { "X-Target-Path": `/transactions/filter/${status}` },
    });
    console.log("Retry successful, response:", response.data);
    return parseTransactionsResponse(response);
    // throw error;
  }
};

export const getAllTransactions = async (): Promise<
  Transaction[] | ApiResponse
> => {
  try {
    // const response = await axios.post(
    const response = await axios.get(
      // "https://medium-server3.vercel.app/api/transactions",
      endpoints.transactions.all,
      null
      // {
      //   // headers: { "X-Target-Path": "/transactions", "w": "valor inicial para obtener todas las transacciones" },
      //   headers: { "w": "valor inicial para obtener todas las transacciones" },

      // }
    );
    return parseTransactionsResponse(response);
  } catch (error) {
    console.log("- Failed to fetch all transactions:", error);
    try {
      // ! FIX: si falla llama de nuevo a la misma ruta
      // const response = await axios.post("/api/transactions", null, {
      //   headers: { "X-Target-Path": "/transactions", "w": "valor6" },
      // });

      // return parseTransactionsResponse(response);
      return { status: 500, message: "Failed to fetch transactions" };
    } catch (retryError) {
      console.error("Retry failed:", retryError);
      return { status: 500, message: "Failed to fetch transactions" };
    }
  }
};

export const createTransaction = async (formData: FormData) => {
  try {
    console.log("Creating transaction with data:", formData);
    console.log("FormData entries:", formData.entries());
    const response = await axios.post(
      "/api/transactions7",
      { ...formData },
      {
        headers: {
          "X-Target-Path": "/transactions/",
          method: "POST",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to create sale :", error);
    throw error;
  }
};

export const getTransactionsByPeriod = async (
  period: "fortnight" | "month" | "all"
) => {
  try {
    console.log("period", period);
    const { start_date, end_date } = getDateRange(period);
    console.log("start_date", start_date);
    console.log("end_date", end_date);
    const response = await axios.get(
      endpoints.transactions.dateRange(start_date, end_date)
    );
    // const response = await axios.post(
    //   endpoints.transactions.all,
    //   { data: { period } },
    //   {
    //     headers: {
    //       "X-Target-Path": "/transactions/date-range/",
    //       w: "busqueda por periodo",
    //     },
    //   }
    // );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch transactions for period ${period}:`, error);
    throw error;
  }
};

function getDateRange(period) {
  const end = new Date();
  let start;
  if (period === "fortnight") {
    start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 15);
  } else if (period === "month") {
    start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate());
  } else if (period === "all") {
    start = new Date(0);
  }

  // Format to "YYYY-MM-DDTHH:mm:ss"
  function formatDate(date) {
    return date.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
  }

  return {
    start_date: formatDate(start),
    end_date: formatDate(end),
  };
}

export const getTransactionsByMixedFilters = async (
  period: "fortnight" | "month" | "all",
  sellerId?: number,
  status?: "pending" | "rejected" | "approved" | "terminado" | null
) => {
  if (!period) {
    throw new Error("Period is required");
  }
  if (period === "all" && !sellerId && !status) return getAllTransactions();
  try {
    const response = await axios.post(
      "/api/transactions/9",
      { data: { period }, query: { seller_id: sellerId, status: status } },
      {
        headers: { "X-Target-Path": "/transactions/filter-mixed/" },
      }
    );
    return parseTransactionsResponse(response);
  } catch (error) {
    console.error(`Failed to fetch transactions for period ${period}:`, error);
    throw error;
  }
};

export const updateTransactionStatus = async (id: number, status: string) => {
  try {
    // const response = await axios.post(
    //   "/api/transactions/",
    //   {
    //     params: { status },
    //   },
    //   {
    //     headers: {
    //       "X-Target-Path": `/transactions/${id}/status`,
    //       method: "PATCH",
    //     },
    //   }
    // );
    const response = await axios.patch(
      endpoints.transactions.updateStatus(id, status)
    );
    return parseTransactionsResponse(response);
  } catch (error) {
    console.error(`Failed to update transaction ${id} status:`, error);
    throw error;
  }
};

export const updateTransactionWithFlightHotel = async (
  id: number,
  flightInfo: FlightInfo,
  hotelInfo: HotelInfo
) => {
  try {
    const BODY = {
      itinerario: [flightInfo],
      travel_info: [hotelInfo],
      status: "terminado",
      
    };
    const response = await axios.patch(
      endpoints.transactions.saveCompleteTransaction(id),
      BODY
    );
    return parseTransactionsResponse(response);
  } catch (error) {
    console.error(`Failed to complete transaction ${id}:`, error);
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
    // const response = await axios.post("/api/users", null, {
    //   headers: { "X-Target-Path": "/users/" },
    // });
    // alert(endpoints.users.all);
    const response = await axios.get(endpoints.users.all);
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
    // const response = await axios.post(
    //   "http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/users/",
    //   user
    // );
    // const response = await axios.post("/api/users", user, {
    const response = await axios.post(endpoints.users.all, user, {
      headers: { "X-Target-Path": "/users/", method: "POST" },
    });
    console.log("User created successfully:", response);
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
      // `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/users/${userId}`
      endpoints.users.delete(userId)
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

// update user using patch
export const updateUser = async (
  userId: number,
  user: {
    name: string;
    email: string;
    role: string;
  }
) => {
  try {
    const response = await axios.patch(
      // `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/users/${userId}`,
      endpoints.users.update(userId),
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
    // const sellers = response.filter(
    //   (user: { role: string }) =>
    //     user.role === "seller" || user.role === "vendedor"
    // );
    // return sellers;
    return response;
  } catch (error) {
    console.error("Failed to fetch sellers:", error);
    throw error;
  }
};

// Get account data for cuentas de recaudo
export const getAccountData = async (): Promise<AccountData[]> => {
  try {
    const response = await axios.get(endpoints.transactions.getAccountData);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch account data:", error);
    throw error;
  }
};

// Get total income metrics
export const getTotalIncomeMetrics = async (fecha_inicio?: string, fecha_fin?: string): Promise<TotalIncomeMetrics> => {
  try {
    const url = endpoints.metrics.getTotalIncome(fecha_inicio, fecha_fin);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch total income metrics:", error);
    throw error;
  }
};

// Get total income metrics by seller
export const getTotalIncomeBySeller = async (userId: number, fecha_inicio?: string, fecha_fin?: string): Promise<TotalIncomeMetrics> => {
  try {
    const url = endpoints.metrics.getTotalIncomeBySeller(userId, fecha_inicio, fecha_fin);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch total income metrics by seller:", error);
    throw error;
  }
};

// Get monthly income by period
export const getMonthlyIncomeByPeriod = async (fecha_inicio: string, fecha_fin: string): Promise<MonthlyIncomeResponse> => {
  try {
    const url = endpoints.metrics.getMonthlyIncomeByPeriod(fecha_inicio, fecha_fin);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch monthly income by period:", error);
    throw error;
  }
};

// Get commissions by user
export const getCommissionsByUser = async (fecha_inicio: string, fecha_fin: string): Promise<CommissionsByUserResponse> => {
  try {
    const url = endpoints.metrics.getCommissionsByUser(fecha_inicio, fecha_fin);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch commissions by user:", error);
    throw error;
  }
};

export default api;
