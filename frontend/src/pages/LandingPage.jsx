import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";
import MarketingNavbar from "../components/MarketingNavbar";
import { useAuth } from "../context/AuthContext";

const flowTabs = [
  {
    id: "member",
    label: "Member Flow",
    title: "How a member uses StackShelf",
    description: "A clean journey from signup to reservations and fine tracking.",
    steps: [
      "Sign up and log in to your personal dashboard.",
      "Search or filter the catalog to find available books.",
      "Reserve a title and receive status updates in real time.",
      "Track due dates, transactions, and overdue notices from one place.",
    ],
  },
  {
    id: "admin",
    label: "Admin Flow",
    title: "How librarians manage operations",
    description: "Control circulation, users, and analytics through a single workflow.",
    steps: [
      "Log in to the admin dashboard for a live operations overview.",
      "Add or update books, categories, and stock visibility.",
      "Issue, return, and monitor reservations with queue awareness.",
      "Review overdue reports, fine automation, and usage insights.",
    ],
  },
];

const appFeatures = [
  {
    title: "Role-Based Authentication",
    description: "Secure JWT login with dedicated Admin and Member workspaces.",
  },
  {
    title: "Book Management",
    description: "Admins can add, edit, delete, and organize books with image support.",
  },
  {
    title: "Smart Search & Filters",
    description: "Find books faster with text search, category filters, and quick matching.",
  },
  {
    title: "Reservation Queue",
    description: "Users can reserve unavailable books and get served in queue order.",
  },
];

const LandingPage = () => {
  const { user } = useAuth();
  const [activeFlow, setActiveFlow] = useState("member");

  const dashPath = user ? (user.role === "admin" ? "/admin" : "/member") : "/login";
  const activeFlowData = flowTabs.find((tab) => tab.id === activeFlow) || flowTabs[0];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-10 md:py-8">
      <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <MarketingNavbar />
        </div>

        <section className="relative overflow-hidden rounded-[2.25rem] border border-white/20 bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-700 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)] md:p-14">
          <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rotate-12 bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-lime-300/40 blur-2xl" />

          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                <Sparkles size={14} /> Digital Library System
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Your books + members + analytics, in one flow.</h1>
              <p className="mt-5 max-w-lg text-base text-white/80 md:text-lg">
                Library operations with reservations, fine tracking, search, and dashboards built for speed.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={user ? dashPath : "/signup"}
                  className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-lime-950/25"
                >
                  {user ? "Go To Dashboard" : "Create Account"}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={user ? "/books" : "/login"}
                  className="rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {user ? "Browse Books" : "Login"}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/70">Books Indexed</p>
                  <p className="mt-2 text-3xl font-semibold">12K+</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/70">Live Reservations</p>
                  <p className="mt-2 text-3xl font-semibold">890</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/70">Overdue Monitoring</p>
                  <p className="mt-2 text-3xl font-semibold">24/7</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/70">Fine Automation</p>
                  <p className="mt-2 text-3xl font-semibold">Cron</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="ui-panel mt-8 rounded-[2rem] p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-400">App Flow</p>
              <h2 className="ui-title text-3xl font-semibold md:text-4xl">How users work inside the platform</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/10 p-1">
              {flowTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFlow(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    activeFlow === tab.id
                      ? "bg-cyan-400 text-slate-900 shadow-sm"
                      : "ui-muted hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFlowData.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6"
            >
              <h3 className="ui-title text-2xl font-semibold">{activeFlowData.title}</h3>
              <p className="ui-muted mt-2 text-sm md:text-base">{activeFlowData.description}</p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {activeFlowData.steps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Step {index + 1}</p>
                    <p className="ui-title mt-2 text-sm leading-6 md:text-base">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <section id="landing-features" className="ui-panel mt-8 rounded-[2rem] p-6 md:p-8">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-400">Platform Highlights</p>
            <h2 className="ui-title text-3xl font-semibold md:text-4xl">What you can do with StackShelf</h2>
            <p className="ui-muted mt-3 max-w-3xl text-sm leading-7 md:text-base">
              From secure access control to faster catalog operations, these are the key capabilities users rely on daily.
            </p>
          </div>

          <div className="relative pt-2 md:pt-4">
            <div className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-300/15 via-cyan-400/35 to-cyan-300/15 md:block" />
            <div className="absolute bottom-0 left-1/2 top-0 hidden w-1.5 -translate-x-1/2 bg-cyan-400/8 blur-sm md:block" />
            {appFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="relative mb-2 grid grid-cols-1 items-center last:mb-0 md:mb-2 md:grid-cols-2"
              >
                <div className={`${index % 2 === 0 ? "md:pr-4" : "md:col-start-2 md:pl-4"}`}>
                  <div className="relative rounded-3xl border border-white/12 bg-black/12 p-4 shadow-[0_10px_35px_rgba(15,23,42,0.2)] md:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">Feature {index + 1}</p>
                    <h3 className="ui-title mt-2 text-lg font-semibold md:text-xl">{feature.title}</h3>
                    <p className="ui-muted mt-1.5 text-sm leading-6 md:text-[15px]">{feature.description}</p>
                  </div>
                </div>
                <span
                  className={`absolute top-1/2 hidden h-px w-6 -translate-y-1/2 bg-cyan-300/45 md:block ${
                    index % 2 === 0 ? "left-[calc(50%-1.5rem)]" : "left-1/2"
                  }`}
                />
                <span className="absolute left-1/2 top-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/65 bg-cyan-400/85 shadow-[0_0_4px_rgba(34,211,238,0.22)] md:block" />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="landing-contact" className="ui-panel mt-8 rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-400">Contact Us</p>
              <h2 className="ui-title text-3xl font-semibold md:text-4xl">Let us help you run your library smarter.</h2>
              <p className="ui-muted mt-4 max-w-lg text-sm leading-7 md:text-base">
                Reach out for product walkthroughs, onboarding support, or help configuring member and catalog workflows.
              </p>
              <div className="ui-muted mt-6 space-y-2 text-sm md:text-base">
                <p>Email: support@stackshelf.app</p>
                <p>Phone: +91 90000 12345</p>
                <p>Hours: Mon - Sat, 9:00 AM to 6:00 PM</p>
              </div>
            </div>

            <form className="rounded-3xl border border-white/10 bg-black/10 p-5 space-y-4 md:p-6">
              <div className="space-y-2">
                <label className="ui-title text-sm font-medium">Your Name</label>
                <input type="text" className="ui-input w-full" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="ui-title text-sm font-medium">Email Address</label>
                <input type="email" className="ui-input w-full" placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <label className="ui-title text-sm font-medium">Message</label>
                <textarea className="ui-input w-full resize-none" rows="4" placeholder="Tell us how we can help" />
              </div>
              <button type="button" className="ui-btn-primary w-full justify-center">
                Send Message
              </button>
            </form>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </div>
  );
};

export default LandingPage;
