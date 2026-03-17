import { BookOpen, LayoutDashboard, RotateCcw, ScrollText, TimerReset, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ role, onLogout, dark, onToggleTheme }) => {
  const common = [
    { to: "/books", label: "Books", icon: BookOpen },
    { to: "/transactions", label: "Transactions", icon: RotateCcw },
    { to: "/reservations", label: "Reservations", icon: TimerReset },
  ];

  const admin = [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }];
  const member = [{ to: "/member", label: "My Hub", icon: ScrollText }];

  const navItems = role === "admin" ? [...admin, ...common] : [...member, ...common];

  return (
    <aside className="sticky top-0 h-screen w-full max-w-72 border-r border-white/10 bg-slate-950/80 p-4 backdrop-blur">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-400">Digital Library</p>
        <h1 className="text-2xl font-semibold text-slate-100">StackShelf</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-slate-400">Theme</span>
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>
      <button
        onClick={onLogout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/30 px-4 py-3 text-red-300 hover:bg-red-500/10"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
