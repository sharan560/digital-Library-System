import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ dark, onToggle }) => (
  <button
    onClick={onToggle}
    className={`rounded-full border px-3 py-2 transition ${
      dark
        ? "border-amber-500/40 bg-amber-100/10 text-amber-100 hover:bg-amber-200/20"
        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
    }`}
  >
    {dark ? <Sun size={16} /> : <Moon size={16} />}
  </button>
);

export default ThemeToggle;
