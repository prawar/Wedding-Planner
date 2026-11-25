import Link from "next/link";
import { site } from "@/lib/site";
import { PillLink } from "./pill-link";

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
];

/** Floating pill menu. Sits over whatever section is behind it. */
export function Nav() {
  return (
    <header className="flex justify-center px-4 pt-5">
      <nav
        aria-label="Main"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 rounded-[34px] bg-white py-1.5 pr-1.5 pl-6 font-bold text-plum shadow-lg shadow-black/10"
      >
        <Link href="/" className="flex h-11 items-center font-display text-[22px] font-black">
          {site.name}
        </Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hidden h-11 items-center hover:text-magenta sm:flex">
            {l.label}
          </Link>
        ))}
        <PillLink href="/templates" variant="magenta">
          Create invite
        </PillLink>
      </nav>
    </header>
  );
}
