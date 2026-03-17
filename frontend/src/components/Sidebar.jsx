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
    <aside className="sticky top-0 h-screen w-full max-w-72 p-4 md:p-5">
      <div className="ui-panel h-full p-4">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Digital Library</p>
        <h1 className="ui-title text-2xl font-semibold">StackShelf</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-lime-300 text-slate-900"
                  : dark
                    ? "text-slate-200 hover:bg-white/10 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 flex items-center justify-between">
        <span className="ui-muted text-sm">Theme</span>
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>
      <button
        onClick={onLogout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-4 py-3 text-rose-300 hover:bg-rose-500/10"
      >
        <LogOut size={16} />
        Logout
      </button>
      </div>
    </aside>
  );
};

export default Sidebar;
