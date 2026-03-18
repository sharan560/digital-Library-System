import { Library } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MarketingFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const year = new Date().getFullYear();

  const goToContact = () => {
    const contactSection = document.getElementById("landing-contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
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

  return (
    <footer className="ui-panel mt-8 overflow-hidden rounded-3xl border border-white/10">
      <div className="grid gap-10 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        <div>
          <p className="ui-title inline-flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Library size={20} />
            StackShelf
          </p>
          <p className="ui-muted mt-3 max-w-xs text-sm leading-7 md:text-base">
            Digital library management to streamline operations, reservations, and reader access.
          </p>
        </div>

        <div>
          <h3 className="ui-title text-lg font-semibold">Resources</h3>
          <nav className="ui-muted mt-4 flex flex-col gap-2 text-sm md:text-base">
            <Link to="/books" className="w-fit transition-colors hover:text-cyan-400">
              Documentation
            </Link>
            <Link to="/transactions" className="w-fit transition-colors hover:text-cyan-400">
              API
            </Link>
            <button
              type="button"
              onClick={goToContact}
              className="w-fit text-left transition-colors hover:text-cyan-400"
            >
              Support
            </button>
          </nav>
        </div>

        <div id="footer-contact">
          <h3 className="ui-title text-lg font-semibold">Contact</h3>
          <div className="ui-muted mt-4 space-y-2 text-sm md:text-base">
            <p>Email: support@stackshelf.app</p>
            <p>Phone: +91 90000 12345</p>
            <div className="pt-2">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="mr-4 transition-colors hover:text-cyan-400"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-cyan-400"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="ui-muted border-t border-white/10 px-6 py-4 text-center text-sm lg:px-10">
        © {year} StackShelf. All rights reserved.
      </div>
    </footer>
  );
};

export default MarketingFooter;