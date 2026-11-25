import { site } from "@/lib/site";

// TODO: add Terms, Privacy and Refunds links once those pages exist.
export function Footer() {
  return (
    <footer className="flex min-h-11 flex-wrap items-center bg-plum px-6 py-3.5 text-sm text-mist">
      {site.name} · {site.contact}
    </footer>
  );
}
