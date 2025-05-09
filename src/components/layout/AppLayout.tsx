
import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // After initial load, show pulse animation to encourage opening sidebar
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(true);
    }, 3000);

    const endTimer = setTimeout(() => {
      setShowPulse(false);
    }, 9000);

    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setShowPulse(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'ml-0' : '-ml-64'} transition-all duration-300 fixed h-full z-20`}>
        <Sidebar />
      </div>
      <div className="flex-1 overflow-x-hidden">
        <Header />
        <div 
          className={`fixed left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-r-md cursor-pointer z-30 transition-all duration-300 ${sidebarOpen ? 'translate-x-64' : 'translate-x-0'} ${showPulse ? 'animate-pulse' : ''}`}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? '←' : '→'}
        </div>
        <main className={`py-6 px-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
