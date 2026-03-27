import {
  Check,
  ExternalLink,
  Eye,
  Info,
  Mail,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { cn } from "../components/ui/utils";
import { navButtonPrimary } from "../lib/navButtonStyles";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center justify-center mb-6">
          <img src="/logo_civic_lens.png" alt="CivicLens Logo" className="h-16 sm:h-20" />
        </div>
        <h1
          className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 px-2"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          About Civic Lens
        </h1>
        <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
          Promoting transparency and accountability in Canadian government spending through accessible, data-driven
          insights.
        </p>
      </div>

      <div
        className="rounded-2xl p-8 md:p-12 mb-12 border-2"
        style={{
          background: "linear-gradient(to bottom right, #e8eef5, #c3d4e6)",
          borderColor: "#c3d4e6",
        }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#0B2545" }}>
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Civic Lens exists to make Canadian government budgets accessible and understandable for all citizens. We
              believe that transparency in public spending is essential for democratic accountability, and that every
              Canadian should be able to easily see how their tax dollars are being allocated and spent.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 border-2" style={{ borderColor: "#e8eef5" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#e8eef5" }}>
              <Eye className="w-6 h-6" style={{ color: "#2563eb" }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Our Vision
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              To be Canada&apos;s leading platform for budget transparency, where every citizen can easily understand how
              public funds are allocated and spent. We envision a future where government spending data is as
              accessible as checking the weather.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border-2" style={{ borderColor: "#e8eef5" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#dcfce7" }}>
              <Users className="w-6 h-6" style={{ color: "#16a34a" }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Our Values
            </h3>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" style={{ color: "#16a34a" }} />
                Transparency in all our operations
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" style={{ color: "#16a34a" }} />
                Accuracy and data integrity
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" style={{ color: "#16a34a" }} />
                Accessibility for all Canadians
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5" style={{ color: "#16a34a" }} />
                Non-partisan analysis
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 md:p-12 border-2" style={{ borderColor: "#e8eef5" }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4" aria-hidden="true">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Data Collection
              </h3>
              <p className="text-gray-700">
                We gather and verify budget data from official government sources.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4" aria-hidden="true">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Visualization
              </h3>
              <p className="text-gray-700">
                Transform complex numbers into clear, interactive visualizations.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4" aria-hidden="true">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Education
              </h3>
              <p className="text-gray-700">
                Provide context and analysis to help citizens understand the data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 md:p-12 border-2 mb-12" style={{ borderColor: "#e8eef5" }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Why Budget Transparency Matters
        </h2>
        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Democratic Accountability
            </h3>
            <p>
              When citizens can easily access and understand government spending, they can make more informed decisions
              at the ballot box and hold elected officials accountable for fiscal policies.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Informed Public Debate
            </h3>
            <p>
              Transparent budget data enables meaningful discussions about government priorities, trade-offs, and the
              effectiveness of public programs and services.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Civic Engagement
            </h3>
            <p>
              Understanding where tax dollars go helps citizens engage more effectively with their representatives and
              participate in budget consultations and policy discussions.
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-8 mb-12 border-2"
        style={{
          background: "linear-gradient(to right, #e8eef5, #c3d4e6)",
          borderColor: "#c3d4e6",
        }}
      >
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: "#0B2545" }} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Data Sources & Methodology
            </h2>
            <p className="text-gray-700 mb-4">
              The data presented on Civic Lens is aggregated from official government sources including:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#0B2545" }} />
                <span>Government of Canada - Department of Finance Canada</span>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#0B2545" }} />
                <span>Provincial and territorial finance ministries</span>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#0B2545" }} />
                <span>Municipal government budget documents</span>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#0B2545" }} />
                <span>Statistics Canada</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4 italic">
              Note: The data shown on this site is for demonstration purposes. For official budget information, please
              visit the respective government websites.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 border-2" style={{ borderColor: "#e8eef5" }}>
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#e8eef5" }}>
            <Mail className="w-8 h-8" style={{ color: "#0B2545" }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Get In Touch
          </h2>
          <p className="text-gray-600 mb-6">
            Have questions, feedback, or suggestions? We&apos;d love to hear from you. Civic Lens is committed to
            continuous improvement and making budget data even more accessible.
          </p>
          <Link to="/contact-us" className={cn(navButtonPrimary, "inline-flex")}>
            Contact Us
          </Link>
        </div>
      </div>

      <div className="mt-12 p-6 rounded-xl border-2" style={{ backgroundColor: "#e8eef5", borderColor: "#c3d4e6" }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Disclaimer</h3>
        <p className="text-sm text-gray-600">
          Civic Lens is an independent platform designed to promote transparency in government spending. We are not
          affiliated with any government entity. While we strive for accuracy, budget figures and allocations shown
          here are for informational and demonstration purposes coined from official Canada budget website. This platform is not intended for collecting personal information or handling
          sensitive data.
        </p>
      </div>
    </div>
  );
}