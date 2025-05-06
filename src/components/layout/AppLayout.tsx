
import { useNavigate } from "react-router-dom";
import { useEffect, ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const AppLayout = ({ 
  children, 
  requireAuth = true,
  requireAdmin = false 
}: AppLayoutProps) => {
  const { isAuthenticated, isAdmin, setShowErrorModal, setErrorMessage } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate("/login");
    }
    
    if (requireAdmin && !isAdmin && isAuthenticated) {
      setErrorMessage("This page requires administrator privileges");
      setShowErrorModal(true);
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate, requireAuth, requireAdmin, setShowErrorModal, setErrorMessage]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
