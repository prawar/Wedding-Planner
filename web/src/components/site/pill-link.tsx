import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  marigold: "bg-marigold text-plum hover:bg-[#ffc94d]",
  magenta: "bg-magenta text-white hover:bg-[#c41f68]",
  white: "bg-white text-plum hover:bg-blush",
  outlineLight: "border-2 border-white text-white hover:bg-white hover:text-plum",
  outlineDark: "border-2 border-plum text-plum hover:bg-plum hover:text-white",
} as const;

const sizes = {
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
} as const;

type Props = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

/** The rounded "pill" call-to-action used across the marketing pages. */
export function PillLink({ variant = "marigold", size = "md", className, ...props }: Props) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-full font-extrabold transition-colors",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-marigold",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
