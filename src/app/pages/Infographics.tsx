import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "react-router";

const SHARE_LINKS = [
  { name: "Email", href: "mailto:?subject=CivicLens Infographics&body=https://civiclens.ca/infographics", Icon: Mail },
  { name: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=https://civiclens.ca/infographics", Icon: Facebook },
  { name: "X", href: "https://x.com/intent/tweet?url=https://civiclens.ca/infographics&text=Infographics", Icon: Twitter },
  { name: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=https://civiclens.ca", Icon: Linkedin },
];

export default function Infographics() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="mb-10">
            <p className="text-sm text-gray-400">
              <Link to="/" className="hover:text-[#0B2545] transition-colors">
                Home
              </Link>{" "}
              / <span className="text-[#1f7a8c] font-medium">Infographics</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-4xl">
              <h1
                className="text-5xl md:text-6xl font-bold text-[#0B4D68] mb-5"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Infographics
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-[#0B4D68] leading-tight">
                We pioneered the art of using data and design to simplify the budget
              </p>
            </div>

            <div className="self-start md:self-auto">
              <p className="text-[#0B4D68] font-semibold mb-3 text-right">Share this page</p>
              <div className="flex items-center gap-3 text-[#8aa0ad]">
                {SHARE_LINKS.map(({ name, href, Icon }, idx) => (
                  <div key={name} className="flex items-center gap-3">
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Share on ${name}`}
                      title={`Share on ${name}`}
                      className="inline-flex items-center justify-center hover:text-[#0B4D68] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                    {idx < SHARE_LINKS.length - 1 ? <span className="text-gray-300">|</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
