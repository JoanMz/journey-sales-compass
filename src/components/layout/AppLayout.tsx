import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <Header />
        <main className="py-6 px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
