import {
  BookOpen,
  Home,
  Info,
  Mail,
  Menu,
  Wallet,
  X,
} from "lucide-react";
import * as React from "react";
import { Link, Outlet, useLocation } from "react-router";
import logo from "../../assets/logo_civic_lens.png";
import { Footer } from "./footer";
import { cn } from "./ui/utils";

export function Layout() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

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

  const desktopLinkClass = (path: string) =>
    cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
      isActive(path) ? "text-white" : "text-gray-700 hover:text-white",
    );

  const desktopLinkStyle = (path: string): React.CSSProperties => ({
    fontFamily: "Montserrat, sans-serif",
    backgroundColor: isActive(path) ? "#0B2545" : "transparent",
  });

  return (
    <div
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-3 min-w-0 pr-2">
              <img src={logo} alt="CivicLens Logo" className="h-11 sm:h-12 shrink-0" />
            </Link>

            <button
              type="button"
              className="md:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-800 hover:bg-gray-100 border border-transparent hover:border-gray-200"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <nav className="hidden md:flex gap-1" aria-label="Main">
              <Link
                to="/"
                className={desktopLinkClass("/")}
                style={desktopLinkStyle("/")}
                onMouseEnter={(e) => {
                  if (!isActive("/")) e.currentTarget.style.backgroundColor = "#f48945";
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/")) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={desktopLinkClass(item.path)}
                    style={desktopLinkStyle(item.path)}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) e.currentTarget.style.backgroundColor = "#f48945";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {mobileNavOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              aria-label="Close menu"
              onClick={() => setMobileNavOpen(false)}
            />
            <div
              id="mobile-nav-panel"
              className="fixed inset-y-0 right-0 z-50 w-[min(100vw,20rem)] bg-white shadow-2xl md:hidden flex flex-col border-l border-gray-200 pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Menu
                </span>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3 overflow-y-auto" aria-label="Mobile main">
                <Link
                  to="/"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                    isActive("/") ? "bg-[#0B2545] text-white" : "text-gray-800 hover:bg-gray-100",
                  )}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <Home className="w-5 h-5 shrink-0" />
                  Home
                </Link>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                        isActive(item.path) ? "bg-[#0B2545] text-white" : "text-gray-800 hover:bg-gray-100",
                      )}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        ) : null}
      </header>

      <main className="min-w-0 w-full max-w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
