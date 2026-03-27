import { MapPin } from "lucide-react";
import * as React from "react";

import { saveContactSubmission } from "../lib/contactDb";
import { navButtonPrimary } from "../lib/navButtonStyles";
import { cn } from "../components/ui/utils";

type FormState = {
  inquiryType: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  jobTitle: string;
  comments: string;
  email: string;
  phoneNumber: string;
};

const initialState: FormState = {
  inquiryType: "General Enquiries",
  firstName: "",
  lastName: "",
  organizationName: "",
  jobTitle: "",
  comments: "",
  email: "",
  phoneNumber: "",
};

export default function Contact() {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await saveContactSubmission({
        inquiryType: form.inquiryType.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        organizationName: form.organizationName.trim(),
        jobTitle: form.jobTitle.trim(),
        comments: form.comments.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
      });

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit form");
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <h1
            className="text-[1.65rem] sm:text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Contact
          </h1>
          <p className="mt-3 text-base md:text-lg text-white/90 max-w-3xl">
            Have a question or suggestion? Reach out to CivicLens and help us improve access to clear, transparent public
            budget data for everyone.
          </p>
        </div>
      </div>

      {/* Form + contact details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={form.inquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                >
                  <option value="General Enquiries" disabled>
                    General Enquiries
                  </option>
                  <option value="Data Request">Data Request</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership Inquiry">Partnership Inquiry</option>
                  <option value="Media Relations">Media Relations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="organizationName"
                  value={form.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="comments"
                  value={form.comments}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  navButtonPrimary,
                  "disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto justify-center min-h-[44px]",
                )}
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" ? (
                <p className="text-sm text-green-700 font-medium">Thanks! Your message was saved.</p>
              ) : null}
              {status === "error" ? (
                <p className="text-sm text-red-700 font-medium">{errorMessage ?? "Submission failed"}</p>
              ) : null}
            </div>
          </form>

          <aside
            className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
            style={{ borderColor: "#e8eef5" }}
          >
            <h2
              className="text-xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Contact us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Contact us via email{" "}
              <a href="mailto:info@civiclens.ca" className="font-semibold text-[#0B2545] hover:underline">
                info@civiclens.ca
              </a>{" "}
              or telephone{" "}
              <a href="tel:+17785859415" className="font-semibold text-[#0B2545] hover:underline whitespace-nowrap">
                778-585-9415
              </a>
              .
            </p>
            <div className="flex gap-3 text-gray-700">
              <MapPin className="w-5 h-5 shrink-0 text-[#0B2545] mt-0.5" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Address
                </p>
                <address className="not-italic text-sm leading-relaxed">
                  DGL Department, North Island College
                  <br />
                  2300 Ryan Rd
                  <br />
                  Courtenay, BC V9N 8N6
                </address>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
