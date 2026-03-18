import { ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import MarketingFooter from "./MarketingFooter";
import MarketingNavbar from "./MarketingNavbar";

const AuthShell = ({
  dark,
  onToggleTheme,
  eyebrow,
  title,
  description,
  altText,
  altLinkText,
  altLinkTo,
  children,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="mx-auto mb-6 max-w-6xl">
        <MarketingNavbar />
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-700 p-6 text-white shadow-2xl md:p-8 lg:p-10">
          <div className="absolute -left-14 top-16 h-64 w-64 rotate-12 bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-lime-300/30 blur-2xl" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="flex items-center justify-end">
              <ThemeToggle dark={dark} onToggle={onToggleTheme} />
            </div>

            <div className="max-w-xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/90">
                <Sparkles size={14} />
                {eyebrow}
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Library operations with the polish of a product.</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 md:text-base">
                Search, issue, reserve, and track every transaction through a cleaner workflow built for both librarians and members.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Discovery</p>
                <p className="mt-2 text-2xl font-semibold">Smart Search</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Queue Logic</p>
                <p className="mt-2 text-2xl font-semibold">Auto Reserve</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Reliability</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <ShieldCheck size={22} />
                  24/7 Monitoring
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="ui-panel w-full max-w-xl rounded-[2rem] p-6 shadow-2xl md:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-400">{eyebrow}</p>
                <h2 className="ui-title text-3xl font-semibold md:text-4xl">{title}</h2>
                <p className="ui-muted mt-3 max-w-md text-sm leading-6">{description}</p>
              </div>
              <Link to="/" className="ui-btn-secondary hidden md:inline-flex">
                Home
              </Link>
            </div>

            {children}

            <div className="mt-6 border-t border-white/10 pt-5 text-sm">
              <span className="ui-muted">{altText} </span>
              <Link to={altLinkTo} className="font-semibold text-cyan-400 hover:text-cyan-300">
                {altLinkText}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <MarketingFooter />
      </div>
    </div>
  );
};

export default AuthShell;