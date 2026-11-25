import Link from "next/link";
import { CirclePlay } from "lucide-react";
import { Marquee } from "@/components/site/marquee";
import { Nav } from "@/components/site/nav";
import { PillLink } from "@/components/site/pill-link";
import { formatPrice, site } from "@/lib/site";
import { templates } from "@/lib/templates";
import { cn } from "@/lib/utils";

const display = "font-display font-black tracking-tight";
const sectionTitle = cn(display, "text-[clamp(40px,6.5vw,92px)] leading-[0.98]");
const container = "mx-auto w-full max-w-[1240px] px-6";

const fanCard =
  "flex shrink-0 flex-col items-center justify-center gap-2 rounded-[26px] border-[5px] border-white p-4 text-center text-sm font-bold text-plum -mx-3.5";

export function Hero() {
  return (
    <section className="overflow-hidden bg-plum text-white">
      <Marquee />
      <Nav />
      <div className={cn(container, "flex flex-col items-center gap-5 pt-14 text-center")}>
        <p data-anim="hero-fade" className="-rotate-[4deg] rounded-md bg-rose px-4 py-1.5 text-[17px] font-extrabold text-plum">
          ॥ शुभ विवाह ॥
        </p>
        <h1 data-anim="headline" className={cn(display, "text-[clamp(60px,11.5vw,156px)] leading-[0.92]")}>
          Invites
          <br />
          that <em className="text-marigold">move.</em>
        </h1>
        <p data-anim="hero-fade" className="max-w-[560px] text-[clamp(17px,1.8vw,21px)] text-mist">
          Fill one form. Get a wedding website your guests can scroll and a reel-size video they can forward.
        </p>
        <div data-anim="hero-fade" className="flex flex-wrap items-center justify-center gap-3.5">
          <PillLink href="/templates" size="lg">
            Choose a template →
          </PillLink>
          <PillLink href="/templates" size="lg" variant="outlineLight">
            Watch a sample
          </PillLink>
        </div>
      </div>

      <div data-anim="fan" className="flex h-[420px] items-end justify-center pt-14" aria-hidden="true">
        <div className={cn(fanCard, "h-[330px] w-[190px] translate-y-[70px] -rotate-[14deg] bg-[#d9ccf0]")}>Template cover</div>
        <div className={cn(fanCard, "h-[360px] w-[200px] translate-y-[34px] -rotate-[7deg] bg-[#cfe3dd]")}>Template cover</div>
        <div className={cn(fanCard, "relative z-10 h-[400px] w-[220px] rounded-[28px] bg-rose")}>
          <span className="text-xs font-extrabold tracking-[2px]">LIVE DEMO</span>
          <span className="font-display text-3xl leading-[1.05] font-black">
            Meera
            <br />&<br />
            Aarav
          </span>
        </div>
        <div className={cn(fanCard, "h-[360px] w-[200px] translate-y-[34px] rotate-[7deg] bg-[#f2d58a]")}>
          <CirclePlay className="size-10" strokeWidth={1.6} />
          Video invite
        </div>
        <div className={cn(fanCard, "h-[330px] w-[190px] translate-y-[70px] rotate-[14deg] bg-[#f4b9a6]")}>Template cover</div>
      </div>
    </section>
  );
}

export function OneFormTwoInvites() {
  const fields = ["Meera & Aarav", "Mehendi · Haldi · Sangeet · Wedding", "Venue, city"];
  return (
    <section className="relative z-10 bg-white text-plum">
      <div className={cn(container, "flex flex-col gap-10 py-22")}>
        <h2 data-anim="reveal" className={sectionTitle}>
          One form in.
          <br />
          <em className="text-magenta">Two invites out.</em>
        </h2>
        <div data-anim="split" className="flex flex-wrap items-center gap-7">
          <div className="flex min-w-0 flex-[1_1_320px] -rotate-2 flex-col gap-3 rounded-[28px] bg-blush p-7">
            <p className="text-[13px] font-extrabold tracking-[2px]">YOU TYPE THIS ONCE</p>
            {fields.map((f) => (
              <p key={f} className="flex h-[46px] items-center rounded-xl border-[1.5px] border-plum bg-white px-3.5 font-semibold">
                {f}
              </p>
            ))}
          </div>
          <span aria-hidden="true" className="font-display text-6xl font-black text-magenta">
            →
          </span>
          <div className="flex min-w-0 flex-[1_1_380px] flex-wrap justify-center gap-5">
            <div data-anim="output" className="flex h-[340px] max-w-60 flex-[1_1_170px] rotate-3 flex-col justify-end gap-1.5 rounded-[28px] bg-plum p-6 text-white">
              <h3 className="font-display text-[28px] leading-none font-black">Website</h3>
              <p className="text-[15px] text-mist">A link that opens on any phone, with maps, calendar and RSVP</p>
            </div>
            <div data-anim="output" className="flex h-[340px] max-w-60 flex-[1_1_170px] -rotate-3 flex-col justify-end gap-1.5 rounded-[28px] bg-marigold p-6 text-plum">
              <h3 className="font-display text-[28px] leading-none font-black">Video</h3>
              <p className="text-[15px]">A 9:16 reel for WhatsApp and Instagram, made from the same details</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Pick a design", body: "Browse by style and tradition. Open any one with sample details." },
  { title: "Fill one form", body: "Names, families, events, photos. The preview changes as you type, in English or Hindi." },
  { title: "Publish and share", body: "Get your link and, if you add it, your video. Send both on WhatsApp." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-blush text-plum">
      <div className={cn(container, "py-22")}>
        <h2 className="pb-5 text-sm font-extrabold tracking-[3px]">HOW IT WORKS</h2>
        <ol>
          {steps.map((step, i) => (
            <li key={step.title}>
              <div data-anim="rule" className="h-0.5 bg-plum" />
              <div data-anim="reveal" className="flex flex-wrap items-baseline gap-x-9 gap-y-2 py-5.5">
                <span className="flex-[0_0_150px] font-display text-[clamp(48px,7vw,96px)] leading-none font-black text-magenta italic">
                  0{i + 1}
                </span>
                <h3 className={cn(display, "flex-[1_1_300px] text-[clamp(30px,4.5vw,60px)] leading-[1.05]")}>{step.title}</h3>
                <p className="flex-[1_1_260px] text-[17px] text-plum-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div data-anim="rule" className="h-0.5 bg-plum" />
      </div>
    </section>
  );
}

export function DesignsStrip() {
  return (
    <section className="overflow-hidden bg-plum text-white">
      <div className={cn(container, "flex flex-wrap items-end justify-between gap-4 pt-22 pb-10")}>
        <h2 data-anim="reveal" className={sectionTitle}>
          Designs worth
          <br />
          <em className="text-marigold">forwarding.</em>
        </h2>
        <PillLink href="/templates" variant="outlineLight">
          View all templates →
        </PillLink>
      </div>
      <ul data-anim="strip" className="flex w-max gap-5.5 px-6 pb-24">
        {templates.map((t, i) => (
          <li key={t.id} className={cn("w-[250px] shrink-0", i % 2 === 1 && "mt-14")}>
            <Link href={`/templates#${t.id}`} className="group flex flex-col gap-2.5">
              <div
                className="flex h-[400px] items-center justify-center rounded-[26px] text-sm font-bold text-plum transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-1"
                style={{ background: t.tint }}
              >
                Cover artwork
              </div>
              <div className="flex justify-between gap-2 font-bold">
                <span>{t.name}</span>
                <span className="text-marigold">{t.style}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="bg-white text-plum">
      <div className={cn(container, "flex flex-col gap-9 py-22")}>
        <h2 data-anim="reveal" className={sectionTitle}>
          Pay once.
          <br />
          <em className="text-magenta">Only when you publish.</em>
        </h2>
        <div className="flex flex-wrap gap-6">
          <div data-anim="reveal" className="flex flex-[1_1_320px] flex-col gap-2.5 rounded-[28px] border-2 border-plum p-8">
            <h3 className="text-sm font-extrabold tracking-[2px]">WEBSITE INVITE</h3>
            <p className="font-display text-[64px] leading-none font-black">{formatPrice(site.prices.website)}</p>
            <p className="text-[17px] text-plum-muted">
              Your own link · all events · maps and calendar · English and Hindi · edits after publishing
            </p>
            <PillLink href="/templates" variant="outlineDark" size="lg" className="mt-2.5">
              Start with the website
            </PillLink>
          </div>
          <div data-anim="reveal" className="relative flex flex-[1_1_320px] flex-col gap-2.5 rounded-[28px] bg-plum p-8 text-white">
            <p className="absolute -top-4 right-6 rotate-[5deg] rounded-md bg-rose px-4 py-1.5 font-extrabold text-plum">Video add-on</p>
            <h3 className="text-sm font-extrabold tracking-[2px] text-marigold">WEBSITE + VIDEO INVITE</h3>
            <p className="font-display text-[64px] leading-none font-black">{formatPrice(site.prices.websiteAndVideo)}</p>
            <p className="text-[17px] text-mist">
              Everything in the website invite, plus a matching reel-size video ready for WhatsApp and Instagram
            </p>
            <PillLink href="/templates" size="lg" className="mt-2.5">
              Start with both
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClosingBand() {
  return (
    <section className="flex flex-col items-center gap-5.5 overflow-hidden bg-magenta px-6 pt-18 text-center text-white">
      <p className="text-xl font-semibold">Your guests are waiting for the link.</p>
      <PillLink href="/templates" variant="white" size="lg">
        Create your invite →
      </PillLink>
      <p
        data-anim="wordmark"
        aria-hidden="true"
        className="mt-6 font-display text-[clamp(72px,19vw,260px)] leading-[0.8] font-black tracking-[-4px] whitespace-nowrap"
      >
        {site.name}
      </p>
    </section>
  );
}
