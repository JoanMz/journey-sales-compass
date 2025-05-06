
import { Bell, MessageSquare } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();
  
  // Get the appropriate greeting based on user role
  const getRoleDisplay = () => {
    if (!user) return "";
    
    switch (user.role) {
      case "admin":
      case "administrador":
        return "Administrator";
      case "seller":
      case "vendedor":
        return "Sales Agent";
      case "encargado":
        return "Sales Manager";
      default:
        return user.role;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800">Sales Dashboard</h1>
        {user && (
          <p className="text-sm text-gray-600">
            Hello {user.name}, you are logged in as <span className="font-medium">{getRoleDisplay()}</span>
          </p>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </button>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </button>
        <div className="h-10 w-px bg-gray-200 mx-2"></div>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">WhatsApp Integration Active</span>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
