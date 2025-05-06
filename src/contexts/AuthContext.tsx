
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller";
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users for testing
const DEFAULT_ADMIN: User = {
  id: "1",
  name: "Admin User",
  email: "example@gmai.com",
  role: "admin",
  avatar: "/lovable-uploads/8c0e4be7-fa34-4758-9b8e-ba0597b25b77.png",
};

const DEFAULT_USERS: User[] = [
  DEFAULT_ADMIN,
  {
    id: "2",
    name: "John Seller",
    email: "seller@example.com",
    role: "seller",
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Initialize localStorage with default users if not already set
    const storedUsers = localStorage.getItem("crm_users");
    if (!storedUsers) {
      localStorage.setItem("crm_users", JSON.stringify(DEFAULT_USERS));
    }
    
    // Check if user is already logged in
    const storedUser = localStorage.getItem("crm_current_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, we'll use a hardcoded password check
    if (password !== "12345") {
      toast.error("Invalid password");
      return false;
    }

    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem("crm_users");
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;
      
      // Find user by email
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("crm_current_user", JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error("User not found");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("crm_current_user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
