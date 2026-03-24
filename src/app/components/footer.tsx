import { Heart } from "lucide-react";
import { Link } from "react-router";
import { navButtonPrimary } from "../lib/navButtonStyles";

export function Footer() {
  return (
    <footer
      className="text-white mt-16"
      style={{ background: "linear-gradient(to right, #0B2545, #193865)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                💝
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-3 text-white">Donate</h3>
                <p className="text-white/80 text-sm mb-4">
                  Support good work by donating to our mission to improve quality of work we deliver.
                </p>
                <button type="button" className={navButtonPrimary}>
                  Donate Now
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl mb-4 text-white">Budget Access</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/spendings" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  FG Budget Dashboard
                </Link>
              </li>
              <li>
                <Link to="/maps" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  Provincial Data
                </Link>
              </li>
              <li>
                <Link to="/infographics" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  GovSpend
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl mb-4 text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/comparison" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  Tables
                </Link>
              </li>
              <li>
                <Link to="/infographics" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  Infographics
                </Link>
              </li>
              <li>
                <Link to="/maps" className="hover:text-white transition-colors text-white/80 hover:text-white">
                  Maps
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <span>Designed with</span>
              <Heart size={14} className="fill-red-500 text-red-500" />
              <span>by Olamie for 2026 Final Project</span>
            </div>
            <div>
              <span>This project is open source and all content are FREE!</span>
            </div>
            <div className="flex items-center gap-1">
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

