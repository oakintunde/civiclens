import { Home } from "lucide-react";
import { Link } from "react-router";
import { navButtonPrimary } from "../lib/navButtonStyles";
import { cn } from "../components/ui/utils";

export default function NotFound() {
  return (
    <div className="w-full min-w-0 max-w-full" style={{ fontFamily: "Poppins, sans-serif" }}>
      <section
        className="text-white"
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
          <p className="text-sm sm:text-base font-semibold text-white/80 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
            404
          </p>
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 break-words px-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Page not found
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto mb-8 px-2">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/"
            className={cn(navButtonPrimary, "inline-flex items-center justify-center gap-2 min-h-[44px]")}
          >
            <Home className="w-4 h-4 shrink-0" aria-hidden />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
