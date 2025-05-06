
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings, LogOut, Users, ChevronLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`h-full ${collapsed ? 'w-20' : 'w-64'} bg-sidebar border-r border-gray-200 flex flex-col transition-all duration-300 fixed left-0 top-0 z-30`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-brand-purple rounded-full p-2 shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v7h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          {!collapsed && <span className="font-bold text-xl text-gray-800 ml-3 whitespace-nowrap overflow-hidden text-ellipsis">TravelCRM</span>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-transform"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <div className="px-3 mt-6 flex-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1 mb-2">MAIN MENU</p>
        )}
        <nav className="space-y-1">
          {navItems
            .filter(item => !item.adminOnly || isAdmin)
            .map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive(item.path) 
                    ? "bg-brand-purple text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={collapsed ? item.name : ""}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${!collapsed && 'mr-3'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-200">
        {!collapsed && (
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1 mb-2">ACCOUNT</p>
        )}
        <div className={`flex items-center mb-4 ${collapsed ? 'justify-center' : ''}`}>
          <div className={`h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ${!collapsed && 'mr-3'}`}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-brand-purple text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {user?.role === "administrador" ? "admin" : user?.role}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`flex ${collapsed ? 'justify-center w-full' : 'w-full'} items-center px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50`}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut className={`h-5 w-5 flex-shrink-0 ${!collapsed && 'mr-3'}`} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
