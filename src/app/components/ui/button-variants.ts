import { cva } from "class-variance-authority";

/** Aligned with header nav: Montserrat, rounded-lg, navy → orange hover */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors font-[Montserrat,sans-serif] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#0B2545]/25 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#0B2545] text-white hover:bg-[#f48945] hover:text-white",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-[#e8eef5] bg-transparent text-gray-800 hover:bg-[#f48945] hover:text-white hover:border-[#f48945]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent text-gray-700 hover:bg-[#f48945] hover:text-white",
        link: "text-[#0B2545] underline-offset-4 hover:underline bg-transparent px-0 py-0 h-auto min-h-0",
      },
      size: {
        default: "h-auto min-h-0 px-4 py-2",
        sm: "h-auto px-3 py-1.5 text-xs",
        lg: "px-4 py-2 text-sm",
        icon: "size-9 rounded-lg p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
