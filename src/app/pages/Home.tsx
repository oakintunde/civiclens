import {
  ArrowRight,
  BarChart3,
  Building2,
  DollarSign,
  MapPin,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { cn } from "../components/ui/utils";
import { federalBudget2025 } from "../data/budgetData";
import { navButtonOnDarkOutline, navButtonPrimary } from "../lib/navButtonStyles";

export function Home() {
  const totalBudget = federalBudget2025.total;
  const formattedTotal = `$${(totalBudget / 1000000000).toFixed(1)}B`;

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Hero Section */}
      <section
        className="text-white"
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Understanding Canada&apos;s Public Spending
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: "#c3d4e6" }}>
              Explore transparent, accessible data on how your tax dollars are spent at federal, provincial,
              and municipal levels.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/spendings?level=federal" className={cn(navButtonPrimary, "gap-2")}>
                Explore Federal Budget
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </Link>
              <Link to="/spendings?level=province" className={navButtonOnDarkOutline}>
                View Provincial Budgets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2" style={{ borderColor: "#e8eef5" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <DollarSign className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600">2025 Federal Budget</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {formattedTotal}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2" style={{ borderColor: "#e8eef5" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <Users className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Per Capita Spending</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  $12,340
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2" style={{ borderColor: "#e8eef5" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <PieChart className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget Categories</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  12
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Explore Budget Data
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Federal Budget Card */}
          <Link
            to="/spendings?level=federal"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-gray-100"
            style={{
              borderColor: "#e5e7eb",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B2545";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#e8eef5" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0B2545";
                  const icon = e.currentTarget.querySelector("svg");
                  if (icon) (icon as SVGElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#e8eef5";
                  const icon = e.currentTarget.querySelector("svg");
                  if (icon) (icon as SVGElement).style.color = "#0B2545";
                }}
              >
                <BarChart3 className="w-7 h-7" style={{ color: "#0B2545" }} />
              </div>
              <ArrowRight
                className="w-6 h-6 text-gray-400 group-hover:opacity-100 transition-colors"
                style={{ color: "#0B2545", opacity: 0.4 }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Federal Budget
            </h3>
            <p className="text-gray-600 mb-4">
              Explore how the Government of Canada allocates {formattedTotal} across departments, programs, and
              services.
            </p>
            <div
              className="flex items-center gap-2 font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#0B2545" }}
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Provincial Budgets Card */}
          <Link
            to="/spendings?level=province"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-gray-100"
            style={{ borderColor: "#e5e7eb" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B2545";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <Building2 className="w-7 h-7" style={{ color: "#0B2545" }} />
              </div>
              <ArrowRight
                className="w-6 h-6 text-gray-400 group-hover:opacity-100 transition-colors"
                style={{ color: "#0B2545", opacity: 0.4 }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Provincial Budgets
            </h3>
            <p className="text-gray-600 mb-4">
              Compare spending priorities across provinces and territories, including health, education, and
              infrastructure.
            </p>
            <div
              className="flex items-center gap-2 font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#0B2545" }}
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Municipal Budgets Card */}
          <Link
            to="/spendings?level=municipal"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-gray-100"
            style={{ borderColor: "#e5e7eb" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B2545";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <MapPin className="w-7 h-7" style={{ color: "#0B2545" }} />
              </div>
              <ArrowRight
                className="w-6 h-6 text-gray-400 group-hover:opacity-100 transition-colors"
                style={{ color: "#0B2545", opacity: 0.4 }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Municipal Budgets
            </h3>
            <p className="text-gray-600 mb-4">
              Discover how major Canadian cities spend on local services like transit, emergency services, and parks.
            </p>
            <div
              className="flex items-center gap-2 font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#0B2545" }}
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Year Comparison Card */}
          <Link
            to="/comparison"
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-gray-100"
            style={{ borderColor: "#e5e7eb" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0B2545";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <TrendingUp className="w-7 h-7" style={{ color: "#0B2545" }} />
              </div>
              <ArrowRight
                className="w-6 h-6 text-gray-400 group-hover:opacity-100 transition-colors"
                style={{ color: "#0B2545", opacity: 0.4 }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Year-over-Year Trends
            </h3>
            <p className="text-gray-600 mb-4">
              Track budget changes over time and understand spending trends from 2020 to 2025.
            </p>
            <div
              className="flex items-center gap-2 font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#0B2545" }}
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Why Civic Lens Section */}
      <section className="bg-white border-y-2" style={{ borderColor: "#e8eef5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Why Civic Lens?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <BarChart3 className="w-8 h-8" style={{ color: "#0B2545" }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Transparency
              </h3>
              <p className="text-gray-600">
                Access clear, easy-to-understand visualizations of complex government budgets at all levels.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <Users className="w-8 h-8" style={{ color: "#0B2545" }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Accountability
              </h3>
              <p className="text-gray-600">
                Understand where your tax dollars go and hold government accountable for spending decisions.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <TrendingUp className="w-8 h-8" style={{ color: "#0B2545" }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Insights
              </h3>
              <p className="text-gray-600">
                Compare budgets across regions and time periods to identify trends and priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border-2 p-8 md:p-12"
            style={{ borderColor: "#e8eef5" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Text */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Subscribe to get updates
                </h2>
                <p className="text-gray-600">
                  Active citizens are keeping abreast of our work within civic-tech space; you should too!
                </p>
              </div>

              {/* Right Side - Form */}
              <div>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 outline-none transition-all"
                    style={{
                      borderColor: "#d1d5db",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0B2545";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11, 37, 69, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 outline-none transition-all"
                    style={{
                      borderColor: "#d1d5db",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0B2545";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11, 37, 69, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button type="submit" className={cn(navButtonPrimary, "w-full")}>
                    Subscribe
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Entering your name, email address and clicking &quot;Subscribe&quot; means you agree to receive
                    updates about the work we do at CivicLens. The CivicLens will never spam you. Please,{" "}
                    <a href="#" className="hover:underline" style={{ color: "#0B2545" }}>
                      click here
                    </a>{" "}
                    to learn more about how we protect your privacy.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
