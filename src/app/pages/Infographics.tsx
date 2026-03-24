import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";

const SHARE_LINKS = [
  { name: "Email", href: "mailto:?subject=CivicLens Infographics&body=https://civiclens.ca/infographics", Icon: Mail },
  { name: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=https://civiclens.ca/infographics", Icon: Facebook },
  { name: "X", href: "https://x.com/intent/tweet?url=https://civiclens.ca/infographics&text=Infographics", Icon: Twitter },
  { name: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=https://civiclens.ca", Icon: Linkedin },
];

export default function Infographics() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <section
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-3xl">
              <h1
                className="text-4xl md:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Infographics
              </h1>
              <p className="text-base md:text-lg text-white/90">
                We turn complex public finance data into clear, visual stories that make budgets easier to understand.
              </p>
            </div>

            <div className="self-start md:self-auto">
              <p className="text-white font-semibold mb-3 md:text-right">Share this page</p>
              <div className="flex items-center gap-2 md:justify-end">
                {SHARE_LINKS.map(({ name, href, Icon }, idx) => (
                  <div key={name} className="flex items-center gap-2">
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Share on ${name}`}
                      title={`Share on ${name}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-white/80 text-white hover:bg-[#f48945] hover:border-[#f48945] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                    {idx < SHARE_LINKS.length - 1 ? <span className="text-white/40">|</span> : null}
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
