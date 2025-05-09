
import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
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
      <div className="flex-1 flex flex-col ml-20 md:ml-20 lg:ml-20 xl:ml-20 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
