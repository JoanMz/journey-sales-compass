
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "administrador";
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  showErrorModal: boolean;
  setShowErrorModal: (show: boolean) => void;
  errorMessage: string;
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Authentication failed. Please try again.");
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("crm_current_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First try to connect to the API
      const response = await axios.post(
        `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {},
        {
          headers: {
            accept: 'application/json',
          }
        }
      );
      
      const userData = response.data;
      
      // Check if user is admin/administrador
      if (userData && (userData.role === "administrador" || userData.role === "admin")) {
        const loggedInUser: User = {
          id: userData.user_id.toString(),
          name: userData.name,
          email: email,
          role: userData.role as "admin" | "seller" | "administrador",
        };
        
        setUser(loggedInUser);
        localStorage.setItem("crm_current_user", JSON.stringify(loggedInUser));
        localStorage.setItem("crm_access_token", userData.access_token);
        localStorage.setItem("crm_refresh_token", userData.refresh_token);
        
        toast.success(`Welcome back, ${loggedInUser.name}!`);
        return true;
      } else {
        // User is not an admin
        setErrorMessage("Access denied: Only administrators can access this system");
        setShowErrorModal(true);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Fallback to default users for demo if API fails
      if (email === "example@gmai.com" && password === "12345") {
        setUser(DEFAULT_ADMIN);
        localStorage.setItem("crm_current_user", JSON.stringify(DEFAULT_ADMIN));
        toast.success(`Welcome back, ${DEFAULT_ADMIN.name}! (Demo Mode)`);
        return true;
      }
      
      // Show error modal
      setErrorMessage("Invalid credentials. Please try again.");
      setShowErrorModal(true);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("crm_current_user");
    localStorage.removeItem("crm_access_token");
    localStorage.removeItem("crm_refresh_token");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin" || user?.role === "administrador",
        showErrorModal,
        setShowErrorModal,
        errorMessage
      }}
    >
      {children}
      <AuthErrorModal />
    </AuthContext.Provider>
  );
};

const AuthErrorModal = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) return null;
  
  return (
    <Dialog open={auth.showErrorModal} onOpenChange={auth.setShowErrorModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" /> Authentication Error
          </DialogTitle>
          <DialogDescription>
            {auth.errorMessage}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => auth.setShowErrorModal(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
