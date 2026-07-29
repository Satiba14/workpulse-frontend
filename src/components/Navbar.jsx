import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, History, ClipboardList, TrendingDown, MessageSquare, FileText } from 'lucide-react';
import NotificationBell from './NotificationBell';

const routeConfig = {
  '/': { label: 'Dashboard', icon: LayoutDashboard },
  '/employees': { label: 'Employees', icon: Users },
  '/departments': { label: 'Departments', icon: Building2 },
  '/audit-log': { label: 'Audit Log', icon: History },
  '/attrition': { label: 'Attrition', icon: TrendingDown },
  '/concerns': { label: 'Employee Concerns', icon: MessageSquare },
  '/exit-interviews': { label: 'Exit Interview', icon: ClipboardList },
  '/documents': { label: 'Employee Documents', icon: FileText },
};

const Navbar = () => {
  const location = useLocation();
  const currentPath = '/' + location.pathname.split('/')[1];
  
  // Get config for current route, default to Dashboard if not found
  const config = routeConfig[currentPath] || { label: 'Dashboard', icon: LayoutDashboard };
  const Icon = config.icon;

  return (
    // Added gap-2 and adjusted padding slightly for mobile
    <div className="relative px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-2">
      
      {/* LEFT — Rounded Badge Title with Icon */}
      {/* Added shrink-0 and whitespace-nowrap so the badge doesn't squish or wrap */}
      <div className="flex items-center gap-2 sm:gap-2.5 bg-blue-600 shadow-md shadow-blue-200 dark:shadow-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-full ml-10 lg:ml-0 shrink-0 z-10">
        <Icon className="text-white w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide pr-1 whitespace-nowrap">
          {config.label}
        </h2>
      </div>

      {/* CENTER — LOGO */}
      {/* FIX: Use standard flex layout on mobile, switch to absolute centering only on md+ screens */}
      <div className="flex items-center ml-auto mr-4">
      </div>

      <div className="flex items-center ml-auto">
         <img
    src="/invenger-logo.png"
    alt="Invenger"
    className="h-5 sm:h-7 md:h-8 object-contain"
  />
  <NotificationBell />
</div>

      {/* Hidden on mobile to prevent throwing off the flex spacing when empty */}
      <div className="hidden md:flex items-center gap-4">
        {/* Future controls */}
      </div>
    </div>
  );
};

export default Navbar;