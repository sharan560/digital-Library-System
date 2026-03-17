import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-16 top-6 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="mx-auto grid max-w-[1500px] md:grid-cols-[280px_1fr]">
        <Sidebar role={user?.role} onLogout={logout} dark={dark} onToggleTheme={toggleTheme} />
        <main className="relative p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
