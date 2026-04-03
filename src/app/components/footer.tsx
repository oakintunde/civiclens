import { Heart } from "lucide-react";
import { Link } from "react-router";
import { navButtonOnDarkOutline } from "../lib/navButtonStyles";

export function Footer() {
  return (
    <footer
      className="text-white mt-16 pb-[env(safe-area-inset-bottom)]"
      style={{ background: "linear-gradient(to right, #0B2545, #193865)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-8">
          <div className="min-w-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                💝
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-3 text-white">Donate</h3>
                <p className="text-white/80 text-sm mb-4">
                  Support good work by donating to our mission to improve quality of work we deliver.
                </p>
                <a
                  href="https://square.link/u/mGc4fJlM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navButtonOnDarkOutline}
                >
                  Donate Now
                </a>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-xl mb-4 text-white">Budget Access</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  to="/spendings?level=federal"
                  className="hover:text-white transition-colors text-white/80 hover:text-white"
                >
                  Federal budget
                </Link>
              </li>
              <li>
                <Link
                  to="/spendings?level=province"
                  className="hover:text-white transition-colors text-white/80 hover:text-white"
                >
                  Provincial budgets
                </Link>
              </li>
              <li>
                <Link
                  to="/spendings?level=municipal"
                  className="hover:text-white transition-colors text-white/80 hover:text-white"
                >
                  Municipal budgets
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-xl mb-4 text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/comparison" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  Year-over-year trends
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  About us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-sm text-white/80 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-1 gap-y-1 max-w-full px-1">
              <span>Designed with</span>
              <Heart size={14} className="fill-red-500 text-red-500 shrink-0" />
              <span className="break-words">
                by{" "}
                <a
                  href="https://www.linkedin.com/in/usman-olaoluwa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white transition-colors"
                >
                  Olamie
                </a>{" "}
                for 2026 Final Project
              </span>
            </div>
            <div className="max-w-md md:max-w-xs lg:max-w-md px-2 break-words">
              <span>This project is open source and all content are FREE!</span>
            </div>
            <div className="flex items-center justify-center gap-1 shrink-0">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-600 text-xs">
                ©
              </span>
              <span>2026 Advanced Project</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

