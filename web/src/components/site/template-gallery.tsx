"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PillLink } from "@/components/site/pill-link";
import { formatPrice, site } from "@/lib/site";
import { templates, templateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";

const filters = ["All", ...templateStyles, "With video"] as const;
type Filter = (typeof filters)[number];

export function TemplateGallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = templates.filter((t) => filter === "All" || (filter === "With video" ? t.hasVideo : t.style === filter));

  return (
    <>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter designs">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "h-11 rounded-full border-[1.5px] border-plum px-4.5 text-[15px] font-semibold transition-colors",
              filter === f ? "bg-plum text-white" : "bg-white text-plum hover:bg-blush",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        {shown.map((t, i) => (
          <li
            key={t.id}
            id={t.id}
            className={cn("flex flex-col overflow-hidden rounded-[26px] border-2 border-plum", i % 2 === 1 && "sm:mt-10")}
          >
            <div className="relative flex h-80 items-center justify-center text-sm font-semibold" style={{ background: t.tint }}>
              Cover artwork
              {t.hasVideo && <Badge className="absolute top-3 left-3 h-7 bg-plum px-3 text-[13px] font-bold text-white">Video</Badge>}
            </div>
            <div className="flex flex-col gap-2.5 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-[19px] font-bold">{t.name}</h2>
                <span className="font-bold">{formatPrice(site.prices.website)}</span>
              </div>
              <p className="text-sm text-plum-muted">
                {t.style} · {t.tradition}
              </p>
              <div className="flex gap-2">
                <PillLink href={`/templates#${t.id}`} variant="outlineDark" className="h-[46px] flex-1 px-0">
                  Preview
                </PillLink>
                <PillLink href={`/templates#${t.id}`} variant="magenta" className="h-[46px] flex-1 px-0">
                  Use this
                </PillLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="text-plum-muted">No designs in this style yet.</p>}
    </>
  );
}
