import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Data types
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
  status: "Success" | "On Process" | "Canceled";
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
  customers: Customer[];
  users: User[];
  weeklyData: WeeklyData[];
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

const DEFAULT_SALES: Sale[] = [
  { 
    id: "s1", 
    customerId: "c1", 
    customerName: "Daniel Rivera",
    customerAvatar: "https://i.pravatar.cc/150?img=1",
    package: "Paris Tour Package", 
    date: "2025-07-15", 
    status: "Success", 
    amount: 1200,
    sellerName: "John Seller",
    sellerId: "2"
  },
  { 
    id: "s2", 
    customerId: "c2", 
    customerName: "Miguel Muñoz",
    customerAvatar: "https://i.pravatar.cc/150?img=2",
    package: "Barcelona Tour", 
    date: "2025-08-10", 
    status: "On Process", 
    amount: 850,
    sellerName: "John Seller",
    sellerId: "2"
  },
  { 
    id: "s3", 
    customerId: "c3", 
    customerName: "Gustavo Chipantiza",
    customerAvatar: "https://i.pravatar.cc/150?img=3",
    package: "Tokyo Adventure", 
    date: "2025-09-05", 
    status: "On Process", 
    amount: 1750,
    sellerName: "Admin User",
    sellerId: "1"
  },
  { 
    id: "s4", 
    customerId: "c4", 
    customerName: "Manuel Alejandro Gruezo",
    customerAvatar: "https://i.pravatar.cc/150?img=4",
    package: "Bali Vacation", 
    date: "2025-07-25", 
    status: "Success", 
    amount: 950,
    sellerName: "Admin User",
    sellerId: "1"
  },
  { 
    id: "s5", 
    customerId: "c5", 
    customerName: "Sofia Salinas",
    customerAvatar: "https://i.pravatar.cc/150?img=5",
    package: "Student Adventure", 
    date: "2025-08-12", 
    status: "On Process", 
    amount: 1250,
    sellerName: "John Seller",
    sellerId: "2"
  },
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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

  // Load initial data
  useEffect(() => {
    // Load or initialize sales data
    const storedSales = localStorage.getItem("crm_sales");
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    } else {
      localStorage.setItem("crm_sales", JSON.stringify(DEFAULT_SALES));
      setSales(DEFAULT_SALES);
    }

    // Load or initialize customers data
    const storedCustomers = localStorage.getItem("crm_customers");
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      localStorage.setItem("crm_customers", JSON.stringify(DEFAULT_CUSTOMERS));
      setCustomers(DEFAULT_CUSTOMERS);
    }

    // Load or initialize users data
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

    // Load or initialize weekly data
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
  };

  const updateSaleStatus = (id: string, status: Sale["status"]) => {
    setSales(sales.map(sale => 
      sale.id === id ? { ...sale, status } : sale
    ));
    toast.success(`Sale status updated to ${status}`);
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
    toast.success("Sale deleted successfully");
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
    // Prevent deleting the current user
    if (user?.id === id) {
      toast.error("You cannot delete your own account");
      return;
    }
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  // Calculate metrics
  const metrics = {
    totalSales: sales.filter(sale => sale.status === "Success").length,
    totalRevenue: sales
      .filter(sale => sale.status === "Success")
      .reduce((total, sale) => total + sale.amount, 0),
    totalCustomers: customers.length,
  };

  return (
    <DataContext.Provider
      value={{
        sales,
        customers,
        users,
        weeklyData,
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
