"use client";

import { useRef, useEffect, useState } from "react";
import { useSiteLang } from "@/components/providers/AppShell";

function CountUpNumber({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.round(target * easeProgress);

            if (frame >= totalFrames) {
              setCount(target);
              clearInterval(counter);
            } else {
              setCount(currentCount);
            }
          }, frameDuration);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsBannerSection() {
  const { lang } = useSiteLang();
  const isTa = lang === "ta";

  return (
    <section className="w-full border-t border-b border-border bg-[#0d170e]/90 py-12 md:py-16 backdrop-blur-md">
      <div className="page-container grid grid-cols-2 gap-8 text-center md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {[
          { num: 500, suffix: "+", l: isTa ? "சரிபார்க்கப்பட்ட விற்பனையாளர்கள்" : "Verified dealers" },
          { num: 100, suffix: "+", l: isTa ? "சரிபார்க்கப்பட்ட நிபுணர்கள்" : "Verified experts" },
          { num: 1000, suffix: "+", l: isTa ? "நிலம் & வீடு விளம்பரங்கள்" : "Real estate listings" },
          { num: 6, suffix: "", l: isTa ? "மாவட்ட சேவை பகுதிகள்" : "District service area" },
        ].map((s) => (
          <div key={s.l} className="group flex flex-col items-center justify-center pt-6 md:pt-0 px-2 cursor-pointer transition-transform duration-300">
            <div 
              className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent group-hover:text-primary transition-all duration-500 tracking-tight group-hover:scale-105 group-hover:drop-shadow-[0_0_25px_rgba(76,175,80,0.5)] select-none"
              style={{ WebkitTextStroke: "2px #4CAF50" }}
            >
              <CountUpNumber target={s.num} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-xs md:text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
