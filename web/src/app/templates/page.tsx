import type { Metadata } from "next";
import { Footer } from "@/components/site/footer";
import { Marquee } from "@/components/site/marquee";
import { Nav } from "@/components/site/nav";
import { TemplateGallery } from "@/components/site/template-gallery";

export const metadata: Metadata = { title: "Choose a design" };

export default function TemplatesPage() {
  return (
    <>
      <Marquee />
      <div className="bg-plum pb-5">
        <Nav />
      </div>
      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-6 pt-10 pb-20 text-plum">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(44px,7vw,92px)] leading-[0.98] font-black tracking-tight">
            Pick your <em className="text-magenta">design.</em>
          </h1>
          <p className="text-plum-muted">
            Every design comes as a website. Designs marked Video also have a matching reel-size video.
          </p>
        </div>
        <TemplateGallery />
      </main>
      <Footer />
    </>
  );
}
