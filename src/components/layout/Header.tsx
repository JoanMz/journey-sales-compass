
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
        return "Administrador de Ventas";
      case "seller":
      case "vendedor":
        return "Asesor de Ventas";
      case "encargado":
        return "Supervisor de Equipo de Ventas";
      default:
        return user.role;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between ml-20 transition-all duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800">Panel de Ventas</h1>
        {user && (
          <p className="text-sm text-gray-600">
            Hola {user.name}, estás conectado como <span className="font-medium">{getRoleDisplay()}</span>
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
          <span className="text-sm font-medium mr-2">Chat de Ventas</span>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
