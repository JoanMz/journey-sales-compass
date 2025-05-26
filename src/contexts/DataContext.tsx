
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { getAllTransactions } from "@/lib/api";
import { Transaction } from "@/types/transactions";
import { mapStatusToSpanish } from "@/lib/utils";

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
  status: "Pendiente" | "Aprobado" | "Rechazado";
  amount: number;
  sellerName: string;
  sellerId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "administrador";
  avatar?: string;
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
  addSale: (sale: Omit<Sale, "id">) => void;
  updateSaleStatus: (id: string, status: Sale["status"]) => void;
  deleteSale: (id: string) => void;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
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

export type TransactionStatus = "Pendiente" | "Aprobado" | "Rechazado";

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
      transaction_type: "Internacional",
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
      transaction_type: "Internacional",
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
      transaction_type: "Internacional",
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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      let transactionData: Transaction[] = [];

      if (Array.isArray(data)) {
        transactionData = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) {
          transactionData = data.data;
        } else {
          transactionData = [data].filter(item => item && typeof item === 'object');
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
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Error al cargar transacciones");
      // Use mock data in case of error
      const mockTransactions = getMockTransactions();
      setTransactions(mockTransactions);
      setSales(mockTransactions.map(convertTransactionToSale));
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  // Load initial data
  useEffect(() => {
    fetchTransactions();

    // Load customers data from localStorage or use defaults
    const storedCustomers = localStorage.getItem("crm_customers");
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      localStorage.setItem("crm_customers", JSON.stringify(DEFAULT_CUSTOMERS));
      setCustomers(DEFAULT_CUSTOMERS);
    }

    // Load users data from localStorage or use defaults
    const storedUsers = localStorage.getItem("crm_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers: User[] = [
        { id: "1", name: "Admin User", email: "example@gmail.com", role: "admin" },
        { id: "2", name: "John Seller", email: "seller@example.com", role: "seller" }
      ];
      localStorage.setItem("crm_users", JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }

    // Load weekly data from localStorage or use defaults
    const storedWeeklyData = localStorage.getItem("crm_weekly_data");
    if (storedWeeklyData) {
      setWeeklyData(JSON.parse(storedWeeklyData));
    } else {
      localStorage.setItem("crm_weekly_data", JSON.stringify(DEFAULT_WEEKLY_DATA));
      setWeeklyData(DEFAULT_WEEKLY_DATA);
    }
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
  const addSale = (sale: Omit<Sale, "id">) => {
    const newSale = {
      ...sale,
      id: `s${Date.now()}`,
    };
    setSales([...sales, newSale]);
    toast.success("Sale added successfully!");
    // Note: In a real implementation, this would also call an API to create the transaction
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

  const addUser = (userData: Omit<User, "id">) => {
    const newUser = {
      ...userData,
      id: `u${Date.now()}`,
    };
    setUsers([...users, newUser]);
    toast.success("User added successfully!");
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, ...userData } : user
    ));
    toast.success("User updated successfully");
  };

  const deleteUser = (id: string) => {
    if (user?.id === id) {
      toast.error("You cannot delete your own account");
      return;
    }
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
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
        addSale,
        updateSaleStatus,
        deleteSale,
        addUser,
        updateUser,
        deleteUser,
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
