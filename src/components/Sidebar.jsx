import { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS } from '../constants/menuItems';
import { 
  LogOut, 
  BarChart3, 
  Menu, 
  X, 
  PanelLeftClose, 
  PanelLeftOpen,
  Sun,  
  Moon  
} from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
  return localStorage.getItem('sidebarCollapsed') === 'true';
});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Toggle Theme Function
  const toggleTheme = () => {
  const newDarkMode = !isDarkMode;
  setIsDarkMode(newDarkMode);
  
  if (newDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark'); // Save preference
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light'); // Save preference
  }
};

useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setIsDarkMode(true);
    document.documentElement.classList.add('dark');
  }
}, []);

useEffect(() => {
  localStorage.setItem('sidebarCollapsed', collapsed);
}, [collapsed]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  
  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNav = (path) => { navigate(path); setMobileOpen(false); };
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
  <div className={`
    flex flex-col h-full transition-all duration-300 
    ${collapsed ? 'w-16' : 'w-60'}
    bg-white border-r border-gray-100 
    dark:bg-slate-900 dark:border-slate-800  
  `}>


{/* Header Row */}
<div className="group flex items-center h-[72px] px-3 border-b border-gray-100 dark:border-slate-800">

  {/* Logo Area */}
  <div className="flex-1 flex items-center">
  {collapsed && (
    <div className="relative flex justify-center w-full group">
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-100 dark:bg-slate-800"
      >
        <PanelLeftOpen
          size={18}
          className="text-gray-700 dark:text-gray-300"
        />
      </button>
    </div>
  )}
</div>

  {/* Right Actions */}
  {!collapsed && (
    <div className="flex items-center gap-1 flex-shrink-0">

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <button
        onClick={() => setCollapsed(true)}
        className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        <PanelLeftClose size={18} />
      </button>

    </div>
  )}

</div>

    {/* Menu Items */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${active
                ? `bg-blue-600 text-white shadow-md shadow-blue-200`
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <div className={`flex-shrink-0 rounded-lg p-1 ${active ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-800 group-hover:bg-gray-200'}`}>
              <Icon size={16} className={active ? 'text-white' : 'text-gray-500'} />
            </div>
            {!collapsed && (
              <span className={`text-sm font-semibold truncate ${active ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'}`}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>

      {/* User Profile Area */}
<div className="border-t border-gray-100 dark:border-slate-800 px-3 py-4 space-y-2">

  <button
    onClick={() => navigate('/profile')}
    className={`w-full flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
      collapsed ? 'p-2 justify-center' : 'px-3 py-2'
    }`}
  >
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
      <span className="text-white text-sm font-bold">
        {user?.email?.charAt(0).toUpperCase()}
      </span>
    </div>

    {!collapsed && (
      <div className="overflow-hidden min-w-0 text-left flex-1">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
          {user?.email}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {user?.role}
        </p>
      </div>
    )}
  </button>

  <button
    onClick={handleLogout}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
      collapsed ? 'justify-center' : ''
    }`}
  >
    <LogOut size={16} />
    {!collapsed && <span className="text-sm font-bold">Logout</span>}
  </button>

</div>
  </div>
);
  return (
    <>
      {/* Mobile hamburger (Remains the same) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 h-full shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-gray-100 bg-white shadow-sm"
            >
              <X size={18} className="text-gray-600" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="hidden lg:flex min-h-screen">
        <SidebarContent />
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default Sidebar;