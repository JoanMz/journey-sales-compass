
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
  setErrorMessage: (message: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Default users for testing
const DEFAULT_ADMIN: User = {
  id: "1",
  name: "Admin User",
  email: "example@gmai.com",
  role: "admin",
  avatar: "/lovable-uploads/8c0e4be7-fa34-4758-9b8e-ba0597b25b77.png",
};

const DEFAULT_SELLER: User = {
  id: "2",
  name: "Luis Seller",
  email: "seller@vive.com",
  role: "seller",
};

const DEFAULT_USERS: User[] = [
  DEFAULT_ADMIN,
  DEFAULT_SELLER,
  {
    id: "3",
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
    // Check if user is already logged in via cookies
    const userCookie = getCookie("crm_current_user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        // Clear invalid cookies
        deleteCookie("crm_current_user");
        deleteCookie("crm_access_token");
        deleteCookie("crm_refresh_token");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First try to connect to the API - using the demo credentials
      if (email === "mariana@example.com" && password === "mariana123") {
        // Simulating API response with predetermined admin data
        const loggedInUser: User = {
          id: "3",
          name: "Mariana",
          email: email,
          role: "administrador",
        };
        
        setUser(loggedInUser);
        setCookie("crm_current_user", JSON.stringify(loggedInUser), 7);
        setCookie("crm_access_token", "demo_token", 7);
        setCookie("crm_refresh_token", "demo_refresh_token", 14);
        
        toast.success(`Welcome back, ${loggedInUser.name}!`);
        return true;
      }
      
      // Handling the seller@vive.com login
      if (email === "seller@vive.com" && password === "luis123") {
        setUser(DEFAULT_SELLER);
        setCookie("crm_current_user", JSON.stringify(DEFAULT_SELLER), 7);
        setCookie("crm_access_token", "demo_seller_token", 7);
        setCookie("crm_refresh_token", "demo_seller_refresh_token", 14);
        
        toast.success(`Welcome back, ${DEFAULT_SELLER.name}!`);
        return true;
      }
      
      // If not using demo credentials, try the API
      try {
        const response = await axios.post(
          `http://ec2-35-90-236-177.us-west-2.compute.amazonaws.com:3000/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
          {},
          {
            headers: {
              accept: 'application/json',
            },
            timeout: 5000 // Add timeout to prevent long waits
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
          setCookie("crm_current_user", JSON.stringify(loggedInUser), 7);
          setCookie("crm_access_token", userData.access_token, 7);
          setCookie("crm_refresh_token", userData.refresh_token, 14);
          
          toast.success(`Welcome back, ${loggedInUser.name}!`);
          return true;
        } else {
          // User is not an admin
          setErrorMessage("Access denied: Only administrators can access this system");
          setShowErrorModal(true);
          return false;
        }
      } catch (apiError) {
        console.error("API Login error:", apiError);
        throw apiError; // Re-throw to be caught by outer catch
      }
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Fallback to default users for demo if API fails
      if (email === "example@gmai.com" && password === "12345") {
        setUser(DEFAULT_ADMIN);
        setCookie("crm_current_user", JSON.stringify(DEFAULT_ADMIN), 7);
        toast.success(`Welcome back, ${DEFAULT_ADMIN.name}! (Demo Mode)`);
        return true;
      }
      
      // Show error modal with appropriate message
      if (axios.isAxiosError(error) && error.message.includes('Network Error')) {
        setErrorMessage("Unable to connect to the authentication server. Please try again later or use demo credentials.");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
      setShowErrorModal(true);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Remove all auth cookies
    deleteCookie("crm_current_user");
    deleteCookie("crm_access_token");
    deleteCookie("crm_refresh_token");
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
        errorMessage,
        setErrorMessage
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
