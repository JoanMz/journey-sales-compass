
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings, LogOut, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAdmin = user?.role === "admin" || user?.role === "administrador";

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/", adminOnly: false },
    { name: "Metrics", icon: BarChart3, path: "/metrics", adminOnly: true },
    { name: "Team", icon: Users, path: "/team", adminOnly: true },
    { name: "Settings", icon: Settings, path: "/settings", adminOnly: false },
  ];

  return (
    <div className="h-full w-64 bg-sidebar border-r border-gray-200 flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <div className="bg-brand-purple rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v7h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
        <span className="font-bold text-xl text-gray-800">TravelCRM</span>
      </div>

      <div className="px-4 mt-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MENU</p>
        <nav className="mt-3 space-y-1">
          {navItems
            .filter(item => !item.adminOnly || isAdmin)
            .map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive(item.path) 
                    ? "bg-brand-purple text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
        </nav>
      </div>

      <div className="mt-auto px-4 mb-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">ACCOUNT</p>
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-brand-purple text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role === "administrador" ? "admin" : user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
