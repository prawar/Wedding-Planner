"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * All home-page animation lives here so the sections themselves stay plain
 * server-rendered markup. Elements opt in with data-anim attributes. With
 * reduced motion (or no JavaScript) the page simply shows its final state.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero headline: letters rise in one by one.
        const split = SplitText.create("[data-anim='headline']", { type: "chars", mask: "chars" });
        gsap.from(split.chars, { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.035 });
        gsap.from("[data-anim='hero-fade']", { opacity: 0, y: 24, duration: 0.8, delay: 0.5, stagger: 0.12 });

        // Phone fan: every card starts stacked in the centre, then fans out.
        gsap.from("[data-anim='fan'] > *", {
          x: (_i, el) => {
            const parent = (el as HTMLElement).parentElement!.getBoundingClientRect();
            const box = (el as HTMLElement).getBoundingClientRect();
            return parent.left + parent.width / 2 - (box.left + box.width / 2);
          },
          y: 60,
          rotation: 0,
          opacity: 0,
          duration: 1.1,
          delay: 0.7,
          ease: "back.out(1.4)",
          stagger: { each: 0.06, from: "center" },
        });

        // Generic reveal for section content.
        gsap.utils.toArray<HTMLElement>("[data-anim='reveal']").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 48,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        // "One form in, two invites out": outputs slide away from the form.
        gsap.from("[data-anim='output']", {
          xPercent: -60,
          opacity: 0,
          rotation: 0,
          stagger: 0.15,
          scrollTrigger: { trigger: "[data-anim='split']", start: "top 75%", end: "top 25%", scrub: 0.6 },
        });

        // How it works: each rule draws across.
        gsap.utils.toArray<HTMLElement>("[data-anim='rule']").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        // Designs strip drifts sideways as the page scrolls.
        const strip = root.current?.querySelector<HTMLElement>("[data-anim='strip']");
        if (strip) {
          gsap.to(strip, {
            x: () => -Math.max(0, strip.scrollWidth - window.innerWidth + 48),
            ease: "none",
            scrollTrigger: { trigger: strip, start: "top 90%", end: "bottom 10%", scrub: 0.5, invalidateOnRefresh: true },
          });
        }

        // Footer brand name slides up.
        gsap.from("[data-anim='wordmark']", {
          yPercent: 60,
          ease: "none",
          scrollTrigger: { trigger: "[data-anim='wordmark']", start: "top bottom", end: "bottom bottom", scrub: 0.4 },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
