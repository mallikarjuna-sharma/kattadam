"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

type Props = {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
};

export default function BannerCarousel({ slides, intervalMs = 3500, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, intervalMs, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden bg-cement-100 shadow-sm ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured offers"
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={s.src} className="w-full flex-shrink-0" aria-hidden={i !== index}>
            <img
              src={s.src}
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="w-full h-[130px] sm:h-auto block select-none"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white shadow" : "w-1.5 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
