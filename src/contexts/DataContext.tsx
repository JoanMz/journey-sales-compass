import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { getAllTransactions, getUsers, createUser, deleteUser as deleteUserApi, updateUser as updateUserApi, createTransaction, updateTransactionStatus, updateTransactionWithFlightHotel } from "@/lib/api";
import { Transaction, FlightInfo, HotelInfo } from "@/types/transactions";
import { SalesFormData } from "@/types/sales";
import { mapStatusToSpanish } from "@/lib/utils";
import { create } from "domain";
import axios from "axios";

// Updated data types - now using Transaction as the primary type
export type Customer = {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
};

export type Sale = {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  package: string;
  date: string;
  status: "Pendiente" | "Aprobado" | "Rechazado"| "Terminado";
  amount: number;
  sellerName: string;
  sellerId: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "seller" | "administrador" | "vendedor";
  avatar?: string;
  phone_number?: string | null;
  password?: string;
};

export type WeeklyData = {
  day: string;
  value: number;
};

type DataContextType = {
  sales: Sale[];
  transactions: Transaction[];
  customers: Customer[];
  users: User[];
  weeklyData: WeeklyData[];
  loading: boolean;
  error: string | null;
  refreshTransactions: () => Promise<void>;
  addTransaction: (formData: FormData) => Promise<Transaction>;
  updateSaleStatus: (id: string, status: Sale["status"]) => void;
  deleteSale: (id: string) => void;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  updateTransactionStatus: (id: number, status: string) => Promise<void>;
  completeTransaction: (id: number, flightInfo: FlightInfo, hotelInfo: HotelInfo) => Promise<void>;
  metrics: {
    totalSales: number;
    totalRevenue: number;
    totalCustomers: number;
  };
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data with updated customer names
const DEFAULT_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Daniel Rivera", avatar: "https://i.pravatar.cc/150?img=1", email: "daniel@example.com", phone: "+1234567890" },
  { id: "c2", name: "Miguel Muñoz", avatar: "https://i.pravatar.cc/150?img=2", email: "miguel@example.com" },
  { id: "c3", name: "Gustavo Chipantiza", avatar: "https://i.pravatar.cc/150?img=3", email: "gustavo@example.com" },
  { id: "c4", name: "Manuel Alejandro Gruezo", avatar: "https://i.pravatar.cc/150?img=4", email: "manuel@example.com" },
  { id: "c5", name: "Sofia Salinas", avatar: "https://i.pravatar.cc/150?img=5", email: "sofia@example.com" },
];

const DEFAULT_WEEKLY_DATA: WeeklyData[] = [
  { day: "Sun", value: 2500 },
  { day: "Mon", value: 3200 },
  { day: "Tue", value: 1800 },
  { day: "Wed", value: 2100 },
  { day: "Thu", value: 2900 },
  { day: "Fri", value: 1500 },
  { day: "Sat", value: 2300 },
];

export type TransactionStatus = "Pendiente" | "Aprobado" | "Rechazado"| "Terminado";

export interface TransaccionesClientesProps {
  sales: Sale[];
}

// Helper function to convert Transaction to Sale format
const convertTransactionToSale = (transaction: Transaction): Sale => ({
  id: transaction.id.toString(),
  customerId: transaction.id.toString(),
  customerName: transaction.client_name,
  customerAvatar: "",
  package: transaction.package,
  date: transaction.start_date,
  status: mapStatusToSpanish(transaction.status),
  amount: transaction.amount,
  sellerName: transaction.seller_name,
  sellerId: transaction.seller_id.toString()
});

// Mock transactions for fallback
const getMockTransactions = (): Transaction[] => {
  return [
    {
      id: 1001,
      client_name: "Sofia Salinas",
      client_email: "sofia@example.com",
      client_phone: "+573145678901",
      client_dni: "1089345678",
      client_address: "Calle 123, Bogotá",
      invoice_image: "",
      id_image: "",
      package: "Student Adventure",
      quoted_flight: "Bogotá - Toulouse",
      agency_cost: 950,
      amount: 1250,
      transaction_type: "abono",
      status: "approved",
      seller_id: 101,
      seller_name: "John Seller",
      receipt: "",
      start_date: "2025-08-12",
      end_date: "2025-08-20",
      travelers: []
    },
    {
      id: 1002,
      client_name: "Daniel Rivera",
      client_email: "daniel@example.com",
      client_phone: "+573156789012",
      client_dni: "1089456789",
      client_address: "Carrera 45, Medellín",
      invoice_image: "",
      id_image: "",
      package: "París Tour Package",
      quoted_flight: "Bogotá - París",
      agency_cost: 1000,
      amount: 1200,
      transaction_type: "abono",
      status: "pending",
      seller_id: 102,
      seller_name: "John Seller",
      receipt: "",
      start_date: "2025-07-15",
      end_date: "2025-07-25",
      travelers: []
    },
    {
      id: 1003,
      client_name: "Miguel Muñoz",
      client_email: "miguel@example.com",
      client_phone: "+573167890123",
      client_dni: "1089567890",
      client_address: "Avenida 67, Cali",
      invoice_image: "",
      id_image: "",
      package: "Barcelona Tour",
      quoted_flight: "Bogotá - Barcelona",
      agency_cost: 800,
      amount: 850,
      transaction_type: "abono",
      status: "rejected",
      seller_id: 101,
      seller_name: "Admin User",
      receipt: "",
      start_date: "2025-08-10",
      end_date: "2025-08-20",
      travelers: []
    }
  ];
};

// Add interface for API response
interface ApiResponse {
  data?: Transaction | Transaction[];
  status?: number;
  message?: string;
}

// Function to create transactions - moved outside component

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const FETCH_COOLDOWN = 30000; // 30 seconds cooldown between fetches

  // Function to check if we should fetch data
  const shouldFetchData = () => {
    const now = Date.now();
    return now - lastFetchTime >= FETCH_COOLDOWN;
  };

  // Updated fetchTransactions function with cooldown check
  const fetchTransactions = async (force = false) => {
    if (!force && !shouldFetchData()) {
      return;
    }

    try {
      setLoading(true);
      const response: Transaction[] | ApiResponse = await getAllTransactions();
      let transactionData: Transaction[] = [];

      if (Array.isArray(response)) {
        transactionData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          transactionData = responseData;
        } else if (responseData && typeof responseData === 'object') {
          transactionData = [responseData].filter(isTransaction);
        }
      }

      // If no transactions were fetched, use mock data
      if (!transactionData.length) {
        transactionData = getMockTransactions();
      }

      setTransactions(transactionData);
      // Convert transactions to sales format for backward compatibility
      const convertedSales = transactionData.map(convertTransactionToSale);
      setSales(convertedSales);
      setError(null);
      setLastFetchTime(Date.now());
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Error al cargar transacciones");
      // Use mock data in case of error
      const mockTransactions = getMockTransactions();
      setTransactions(mockTransactions);
      setSales(mockTransactions.map(convertTransactionToSale));
    } finally {
      setLoading(false) // Add minimum loading time for better UX
    }
  };

  // Updated refreshTransactions function
  const refreshTransactions = async () => {
    await fetchTransactions(true); // Force refresh
  };

  // Function to fetch users from API
  const fetchUsers = async () => {
    try {
      const userData = await getUsers();
      if (Array.isArray(userData) && userData.length > 0) {
        // Map API users to our User type
        const mappedUsers = userData.map(apiUser => ({
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          role: apiUser.role as User['role'],
          phone_number: apiUser.phone_number,
          // Don't include password in the state
        }));
        setUsers(mappedUsers);
      } else {
        // Fallback to default users if API returns empty
        const defaultUsers: User[] = [
          { id: 1, name: "Admin User", email: "example@gmail.com", role: "admin" },
          { id: 2, name: "John Seller", email: "seller@example.com", role: "seller" }
        ];
        setUsers(defaultUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to default users on error
      const defaultUsers: User[] = [
        { id: 2, name: "Admin User", email: "example@gmail.com", role: "admin" },
        { id: 2, name: "John Seller", email: "seller@example.com", role: "seller" }
      ];
      setUsers(defaultUsers);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchTransactions(true); // Initial load should always fetch

    // Load customers data from localStorage or use defaults
    const storedCustomers = localStorage.getItem("crm_customers");
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      localStorage.setItem("crm_customers", JSON.stringify(DEFAULT_CUSTOMERS));
      setCustomers(DEFAULT_CUSTOMERS);
    }

    // Fetch users from API
    fetchUsers();

    // Load weekly data from localStorage or use defaults
    const storedWeeklyData = localStorage.getItem("crm_weekly_data");
    if (storedWeeklyData) {
      setWeeklyData(JSON.parse(storedWeeklyData));
    } else {
      localStorage.setItem("crm_weekly_data", JSON.stringify(DEFAULT_WEEKLY_DATA));
      setWeeklyData(DEFAULT_WEEKLY_DATA);
    }

    // Set up polling with a longer interval
    const interval = setInterval(() => {
      fetchTransactions();
    }, FETCH_COOLDOWN);

    return () => clearInterval(interval);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (sales.length > 0) {
      localStorage.setItem("crm_sales", JSON.stringify(sales));
    }
  }, [sales]);

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem("crm_customers", JSON.stringify(customers));
    }
  }, [customers]);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("crm_users", JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (weeklyData.length > 0) {
      localStorage.setItem("crm_weekly_data", JSON.stringify(weeklyData));
    }
  }, [weeklyData]);

  // CRUD operations
  const addSale = (transaction: Transaction) => {
    setSales([...sales, convertTransactionToSale(transaction)]);
    toast.success("Sale added successfully!");
    // Note: In a real implementation, this would also call an API to create the transaction
  };

  const addTransaction = async (formData: FormData): Promise<Transaction> => {
    try {
      const response = await createTransaction(formData);
      const newTransaction = response.data;

      if (!isTransaction(newTransaction)) {
        throw new Error('Invalid transaction data received from server');
      }

      addSale(newTransaction);
      return newTransaction;
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  };

  const completeTransactionWithInfo = async (id: number, flightInfo: FlightInfo, hotelInfo: HotelInfo) => {
    try {
      await updateTransactionWithFlightHotel(id, flightInfo, hotelInfo);
      
      // Force refresh after completion
      await refreshTransactions();
    } catch (error) {
      console.error(`Failed to complete transaction ${id}:`, error);
      throw error;
    }
  };

  const updateSaleStatus = (id: string, status: Sale["status"]) => {
    setSales(sales.map(sale =>
      sale.id === id ? { ...sale, status } : sale
    ));
    toast.success(`Sale status updated to ${status}`);
    // Note: In a real implementation, this would also call an API to update the transaction
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
    toast.success("Sale deleted successfully");
    // Note: In a real implementation, this would also call an API to delete the transaction
  };

  const addUser = async (userData: Omit<User, "id">) => {
    try {
      // Add a default password if not provided
      const userToCreate = {
        ...userData,
        password: "default123", // Default password
        phone_number: userData.phone_number || ""
      };

      const response = await createUser(userToCreate);

      if (response.message === "Usuario creado con éxito") {
        // Add the new user to the state
        setUsers([...users, response.user]);
        toast.success("User added successfully!");
        // Refresh the users list
        fetchUsers();
      } else {
        toast.error(response.detail || "Failed to create user");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail === "El usuario ya existe") {
        toast.error("User with this email already exists");
      } else {
        toast.error("Failed to create user");
        console.error("Error creating user:", error);
      }
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      // Call the API to update the user
      await updateUserApi(id, {
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
        ...(userData.password ? { password: userData.password } : {}),
        ...(userData.phone_number ? { phone_number: userData.phone_number } : {})
      });

      // Update the local state
      setUsers(users.map(user =>
        user.id === id ? { ...user, ...userData } : user
      ));

      toast.success("User updated successfully");

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id: string | number) => {
    if (user?.id === id) {
      toast.error("You cannot delete your own account");
      return;
    }

    try {
      // Call the API to delete the user
      await deleteUserApi(id.toString());

      // Update the local state
      setUsers(users.filter(user => user.id !== id));
      toast.success("User deleted successfully");

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 204) {
        // If we get a 204 No Content response, it means the deletion was successful
        setUsers(users.filter(user => user.id !== id));
        toast.success("User deleted successfully");
        await fetchUsers();
      } else {
        toast.error("Failed to delete user");
        console.error("Error deleting user:", error);
      }
    }
  };

  const changeTransactionStatus = async (id: number, status: string) => {
    try {
      await updateTransactionStatus(id, status);

      // If status is "completado", trigger document generation
      if (status === "completado") {
        try {
          await axios.post(
            "https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/d5e02b96-c7fa-4358-8120-65fccbee7892",
            { transaction_id: id },
            {
              headers: {
                accept: 'application/json',
              },
              timeout: 5000
            }
          );
        } catch (err) {
          console.error("Error generating document:", err);
        }
      }

      // Force refresh after status update
      await refreshTransactions();
    } catch (error) {
      console.error(`Failed to update transaction ${id} status:`, error);
      throw error;
    }
  };

  // Calculate metrics based on transactions
  const metrics = {
    totalSales: transactions.filter(transaction => transaction.status === "approved").length,
    totalRevenue: transactions
      .filter(transaction => transaction.status === "approved")
      .reduce((total, transaction) => total + transaction.amount, 0),
    totalCustomers: customers.length,
  };

  return (
    <DataContext.Provider
      value={{
        sales,
        transactions,
        customers,
        users,
        weeklyData,
        loading,
        error,
        refreshTransactions,
        addTransaction,
        updateSaleStatus,
        deleteSale,
        addUser,
        updateUser,
        deleteUser,
        updateTransactionStatus: changeTransactionStatus,
        completeTransaction: completeTransactionWithInfo,
        metrics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Update type guard for Transaction to use unknown instead of any
const isTransaction = (obj: unknown): obj is Transaction => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return typeof candidate.id === 'number'
    && typeof candidate.client_name === 'string'
    && typeof candidate.client_email === 'string'
    && typeof candidate.client_phone === 'string'
    && typeof candidate.client_dni === 'string'
    && typeof candidate.package === 'string'
    && typeof candidate.amount === 'number'
    && typeof candidate.status === 'string';
};
