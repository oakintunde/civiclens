import { Facebook, Instagram, Link2, Linkedin, Twitter } from "lucide-react";
import * as React from "react";

type SharePageSocialRowProps = {
  pageUrl: string;
  /** Used for X/Twitter intent text */
  shareTitle: string;
};

export function SharePageSocialRow({ pageUrl, shareTitle }: SharePageSocialRowProps) {
  const encoded = encodeURIComponent(pageUrl);
  const [copied, setCopied] = React.useState(false);

  const copyLink = () => {
    void navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinks = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, Icon: Facebook },
    { name: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(shareTitle)}`,
      Icon: Twitter,
    },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, Icon: Linkedin },
  ];

  return (
    <div className="self-start lg:self-auto w-full lg:w-auto min-w-0">
      <p className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-center lg:text-right">
        Share this page
      </p>
      <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 max-w-full">
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-white/80 px-3 py-2 text-sm font-medium text-white hover:bg-[#f48945] hover:border-[#f48945] transition-colors"
          aria-label={copied ? "Link copied" : "Copy page link"}
        >
          <Link2 className="w-4 h-4 shrink-0" />
          {copied ? "Copied" : "Copy link"}
        </button>
        <span className="text-white/40 hidden sm:inline" aria-hidden>
          |
        </span>
        {shareLinks.map(({ name, href, Icon }, idx) => (
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
            {idx < shareLinks.length - 1 ? <span className="text-white/40">|</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
