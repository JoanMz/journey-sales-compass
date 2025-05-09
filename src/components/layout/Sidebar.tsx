
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings, LogOut, Users, ChevronLeft, MessageSquare, Code, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed
  const [showPulse, setShowPulse] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAdmin = user?.role === "admin" || user?.role === "administrador";

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/", adminOnly: false },
    { name: "Support Stats", icon: BarChart3, path: "/metrics", adminOnly: true },
    { name: "Team", icon: Users, path: "/team", adminOnly: true },
    { name: "Settings", icon: Settings, path: "/settings", adminOnly: false },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setShowPulse(false);
  };

  // Show pulse animation after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (collapsed) {
        setShowPulse(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [collapsed]);

  return (
    <aside className={`h-full ${collapsed ? 'w-20' : 'w-64'} bg-sidebar border-r border-gray-200 flex flex-col transition-all duration-300 fixed left-0 top-0 z-30`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-brand-purple rounded-full p-2 shrink-0">
            <Code className="w-6 h-6 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-xl text-gray-800 ml-3 whitespace-nowrap overflow-hidden text-ellipsis">SupportCRM</span>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-transform ${showPulse ? 'animate-pulse' : ''}`}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? 
            <ChevronRight className={`h-5 w-5 transition-transform ${showPulse ? 'text-blue-500' : ''}`} /> :
            <ChevronLeft className="h-5 w-5 transition-transform" />
          }
        </button>
      </div>

      {/* Navigation */}
      <div className="px-3 mt-6 flex-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1 mb-2">MENU PRINCIPAL</p>
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
                onClick={() => {
                  if (collapsed) {
                    setCollapsed(false);
                    setShowPulse(false);
                    toast.info(`Navegando a ${item.name}`, {
                      duration: 2000,
                    });
                  }
                }}
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
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1 mb-2">CUENTA</p>
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
                {user?.role === "administrador" ? "team lead" : user?.role}
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
