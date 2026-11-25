const items = ["WEBSITE INVITE", "VIDEO INVITE", "ENGLISH + हिंदी", "READY IN TEN MINUTES"];

/** Endless sideways strip. Content is duplicated so the loop is seamless. */
export function Marquee() {
  const run = (hidden: boolean) => (
    <div className="flex shrink-0" aria-hidden={hidden}>
      {[...items, ...items, ...items].map((item, i) => (
        <span key={i} className="px-4">
          {item} <span className="pl-6">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden bg-marigold py-2 text-sm font-extrabold tracking-[2px] whitespace-nowrap text-plum">
      <div className="flex w-max animate-marquee">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
