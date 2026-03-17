import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ dark, onToggle }) => (
  <button
    onClick={onToggle}
    className="rounded-full border border-amber-500/40 bg-amber-100/10 px-3 py-2 text-amber-100 hover:bg-amber-200/20"
  >
    {dark ? <Sun size={16} /> : <Moon size={16} />}
  </button>
);

export default ThemeToggle;
