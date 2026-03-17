import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <div className="mx-auto grid max-w-[1500px] md:grid-cols-[280px_1fr]">
        <Sidebar role={user?.role} onLogout={logout} dark={dark} onToggleTheme={() => setDark((x) => !x)} />
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
