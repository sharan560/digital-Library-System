import { useState } from "react";
import { BookOpen, LayoutDashboard, RotateCcw, ScrollText, TimerReset, LogOut, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ role, onLogout, dark, onToggleTheme }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const common = [
    { to: "/books", label: "Books", icon: BookOpen },
    { to: "/transactions", label: "Transactions", icon: RotateCcw },
    { to: "/reservations", label: "Reservations", icon: TimerReset },
  ];

  const admin = [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }];
  const member = [{ to: "/member", label: "My Hub", icon: ScrollText }];

  const navItems = role === "admin" ? [...admin, ...common] : [...member, ...common];
  const navItemClass = ({ isActive }) =>
    `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition lg:px-4 lg:py-3 lg:text-base ${
      isActive
        ? "bg-lime-300 text-slate-900"
        : dark
          ? "text-slate-200 hover:bg-white/10 hover:text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <>
      <aside className="sticky top-0 z-40 w-full p-2 sm:p-3 lg:hidden">
        <div className="ui-panel flex items-center justify-between p-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-400">Digital Library</p>
            <h1 className="ui-title text-lg font-semibold">StackShelf</h1>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-white/15 p-2 text-slate-200"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 p-3 backdrop-blur-sm lg:hidden">
          <div className="ui-panel mx-auto flex h-[calc(100vh-1.5rem)] w-full max-w-sm flex-col overflow-hidden border-white/10 bg-slate-950/95">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-400">Digital Library</p>
                <h1 className="ui-title text-lg font-semibold">StackShelf</h1>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-white/10 p-2 text-slate-300"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={navItemClass}
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
            </nav>

            <div className="border-t border-white/10 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="ui-muted text-sm">Theme</span>
                <ThemeToggle dark={dark} onToggle={onToggleTheme} />
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-500/10"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden w-full p-3 sm:p-4 lg:sticky lg:top-0 lg:block lg:h-screen lg:max-w-72 lg:p-5">
        <div className="ui-panel p-3 sm:p-4 lg:h-full">
        <div className="mb-4 lg:mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Digital Library</p>
          <h1 className="ui-title text-xl font-semibold sm:text-2xl">StackShelf</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navItemClass}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 flex items-center justify-between lg:mt-6">
          <span className="ui-muted text-sm">Theme</span>
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
        </div>
        <button
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-500/10 lg:mt-8 lg:py-3 lg:text-base"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
