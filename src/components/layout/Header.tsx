
import { Bell, MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800">Sales Dashboard</h1>
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
