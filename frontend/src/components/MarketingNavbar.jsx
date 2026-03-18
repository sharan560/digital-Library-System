import { Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MarketingNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dashPath = user ? (user.role === "admin" ? "/admin" : "/member") : "/login";

  const navigateToContact = () => {
    const section = document.getElementById("landing-contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const fallbackSection = document.getElementById("landing-contact");
        fallbackSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  };

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="ui-panel rounded-[2.2rem] px-5 py-4 shadow-xl md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="ui-title inline-flex items-center gap-2 text-2xl font-bold uppercase tracking-wide md:text-4xl">
          <Sparkles size={20} className="text-cyan-400" />
          StackShelf
          <Sparkles size={20} className="text-cyan-400" />
        </Link>

        <div className="ui-title flex flex-wrap items-center gap-2 text-sm font-semibold md:gap-3 md:text-lg">
          <Link to="/" className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10">
            Home
          </Link>
          <button
            type="button"
            onClick={navigateToContact}
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
          >
            Contact
          </button>
          
          {user ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup" className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10">
                Signup
              </Link>
              <Link to="/login" className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MarketingNavbar;