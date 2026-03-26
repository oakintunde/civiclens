import {
  BookOpen,
  Home,
  Info,
  Mail,
  Wallet,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import logo from "../../assets/logo_civic_lens.png";
import { Footer } from "./footer";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/spendings", label: "Spendings", icon: Wallet },
    { path: "/about-us", label: "About Us", icon: Info },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/contact-us", label: "Contact Us", icon: Mail },
  ];
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Poppins, sans-serif" }}>
      <header
        className="bg-white border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="CivicLens Logo" className="h-10" />
            </Link>

            <nav className="hidden md:flex gap-1">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive("/") ? "text-white" : "text-gray-700 hover:text-white"
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  backgroundColor: isActive("/") ? "#0B2545" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/")) e.currentTarget.style.backgroundColor = "#f48945";
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/")) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path) ? "text-white" : "text-gray-700 hover:text-white"
                    }`}
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      backgroundColor: isActive(item.path) ? "#0B2545" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) e.currentTarget.style.backgroundColor = "#f48945";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <nav className="md:hidden flex overflow-x-auto gap-1 pb-3 -mx-4 px-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive("/") ? "text-white" : "text-gray-700"
              }`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                backgroundColor: isActive("/") ? "#0B2545" : "transparent",
              }}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive(item.path) ? "text-white" : "text-gray-700"
                  }`}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    backgroundColor: isActive(item.path) ? "#0B2545" : "transparent",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
