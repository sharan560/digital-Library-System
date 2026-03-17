import { motion } from "framer-motion";
import { ArrowRight, Library, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { dark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const dashPath = user ? (user.role === "admin" ? "/admin" : "/member") : "/login";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-10">
      <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Library size={22} />
            StackShelf
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
            <Link
              to={dashPath}
              className="rounded-full border border-current/20 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
            >
              Enter App
            </Link>
          </div>
        </header>

        <section className="relative rounded-[2.5rem] border border-black/10 bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-700 p-8 text-white shadow-2xl dark:border-white/20 md:p-14">
          <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rotate-12 bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-lime-300/40 blur-2xl" />

          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                <Sparkles size={14} /> Digital Library System
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">Your books + members + analytics, in one flow.</h1>
              <p className="mt-5 max-w-lg text-base text-white/80 md:text-lg">
                 Library operations with reservations, fine tracking, search, and dashboards built for speed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={user ? dashPath : "/signup"}
                  className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-slate-900"
                >
                  {user ? "Go To Dashboard" : "Create Account"}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={user ? "/books" : "/login"}
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                >
                  {user ? "Browse Books" : "Login"}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-black/25 p-4">
                  <p className="text-white/70">Books Indexed</p>
                  <p className="mt-2 text-3xl font-semibold">12K+</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-4">
                  <p className="text-white/70">Live Reservations</p>
                  <p className="mt-2 text-3xl font-semibold">890</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-4">
                  <p className="text-white/70">Overdue Monitoring</p>
                  <p className="mt-2 text-3xl font-semibold">24/7</p>
                </div>
                <div className="rounded-2xl bg-black/25 p-4">
                  <p className="text-white/70">Fine Automation</p>
                  <p className="mt-2 text-3xl font-semibold">Cron</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
