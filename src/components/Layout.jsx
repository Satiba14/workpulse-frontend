import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Added dark:bg-slate-900 to the default bgClass
const Layout = ({ children, bgClass = 'bg-gray-50 dark:bg-slate-900' }) => {
  return (
    // Added bg-white dark:bg-slate-950 transition-colors
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main
          className={`flex-1 overflow-y-auto p-4 lg:p-6 ${bgClass} transition-colors duration-300`}
        >
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;