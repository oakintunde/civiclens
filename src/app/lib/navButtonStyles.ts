import { cn } from "../components/ui/utils";

/**
 * Matches header nav controls: Montserrat, rounded-lg, px-4 py-2, text-sm font-medium,
 * navy fill + orange hover for primary; transparent + orange hover for ghost.
 */
export const navButtonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors font-[Montserrat,sans-serif]";

export const navButtonPrimary = cn(
  navButtonBase,
  "bg-[#0B2545] text-white hover:bg-[#f48945] hover:text-white",
);

export const navButtonGhost = cn(
  navButtonBase,
  "bg-transparent text-gray-700 hover:bg-[#f48945] hover:text-white",
);

/** Primary CTA on dark / gradient hero (outline, readable on blue) */
export const navButtonOnDarkOutline = cn(
  navButtonBase,
  "border-2 border-white bg-transparent text-white hover:bg-[#f48945] hover:border-[#f48945] hover:text-white",
);
