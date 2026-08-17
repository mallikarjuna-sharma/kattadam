"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import ListingPageShell from "@/components/layout/ListingPageShell";
import DistrictAreaSearch from "@/components/ui/DistrictAreaSearch";
import EnquiryModal from "@/components/ui/EnquiryModal";
import BannerCarousel from "@/components/ui/BannerCarousel";
import {
  MapPin,
  Star,
  Phone,
  CheckCircle,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  LayoutTemplate,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  SERVICES,
  SERVICE_CATEGORY_FILTERS,
  DISTRICT_FILTER_ALL,
  formatLocationLine,
} from "@/lib/mock-data";
import { matchesAreaFilter, matchesLocationSearch } from "@/lib/location-filters";

const SERVICES_BANNER_SLIDES = [
  {
    src: "/banners/banner-service-renovations.png",
    alt: "Home renovations — transform your space — professional design, reliable service",
  },
  {
    src: "/banners/banner-service-electrical.png",
    alt: "Electrical services — empower your home — certified electricians",
  },
  {
    src: "/banners/banner-service-painting.png",
    alt: "Professional painting services — expert painters, color consultations",
  },
  {
    src: "/banners/banner-service-plumbing.png",
    alt: "Professional plumbing services — leak detection & pipe repair",
  },
];

const categoryIcon: Record<string, ReactNode> = {
  Electrical: <Zap className="w-5 h-5 text-yellow-500" />,
  Plumbing: <Wrench className="w-5 h-5 text-blue-500" />,
  Interiors: <Paintbrush className="w-5 h-5 text-purple-500" />,
  Renovations: <LayoutTemplate className="w-5 h-5 text-teal-600" />,
  Painting: <Paintbrush className="w-5 h-5 text-pink-500" />,
  "Masonry works": <Hammer className="w-5 h-5 text-orange-500" />,
};

const categoryBg: Record<string, string> = {
  Electrical: "bg-yellow-50",
  Plumbing: "bg-blue-50",
  Interiors: "bg-purple-50",
  Renovations: "bg-teal-50",
  Painting: "bg-pink-50",
  "Masonry works": "bg-orange-50",
};

const SERVICE_CATEGORY_META: Record<string, { emoji: string; image: string | null }> = {
  All: {
    emoji: "🛠️",
    image: "https://www.pngkey.com/png/full/55-556142_house-cleaning-services-cleaner.png",
  },
  Interiors: {
    emoji: "🛋️",
    image:
      "https://static.vecteezy.com/system/resources/previews/010/880/101/non_2x/3d-interior-design-free-png.png",
  },
  Renovations: {
    emoji: "🏠",
    image:
      "https://png.pngtree.com/png-vector/20240913/ourmid/pngtree-renovated-house-installers-png-image_13212913.png",
  },
  Painting: {
    emoji: "🎨",
    image:
      "https://e7.pngegg.com/pngimages/62/703/png-clipart-house-painter-and-decorator-painting-interior-design-services-painting-building-service-thumbnail.png",
  },
  Electrical: {
    emoji: "⚡",
    image:
      "https://png.pngtree.com/png-clipart/20250415/original/pngtree-electrician-connecting-wires-in-electrical-panel-isolated-on-transparent-background-png-image_20719215.png",
  },
  Plumbing: {
    emoji: "🔧",
    image:
      "https://png.pngtree.com/png-clipart/20241009/original/pngtree-water-pipeline-plumbing-service-plumber-worker-png-image_16250329.png",
  },
  "Masonry works": {
    emoji: "🧱",
    image: "https://3.imimg.com/data3/XR/YB/GLADMIN-176439/masonry-service-250x250.png",
  },
};

function ServiceCategoryImage({
  src,
  alt,
  emoji,
}: {
  src: string;
  alt: string;
  emoji: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl sm:text-5xl" aria-hidden="true">
          {emoji}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [district, setDistrict] = useState<string>(DISTRICT_FILTER_ALL);
  const [area, setArea] = useState("All Areas");
  const [enquiry, setEnquiry] = useState<string | null>(null);

  const filtered = SERVICES.filter((s) => {
    const matchSearch = matchesLocationSearch(search, s.area, [s.name, s.description, s.district]);
    const matchCat = cat === "All" || s.category === cat;
    const matchDistrict = district === DISTRICT_FILTER_ALL || s.district === district;
    const matchArea = matchesAreaFilter(area, s.area);
    return matchSearch && matchCat && matchDistrict && matchArea;
  });

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  return (
    <ListingPageShell
      title="Home services"
      subtitle="Interiors, renovations, painting, electrical, plumbing, masonry"
      searchPlaceholder="Search painting, plumbing, interiors…"
      search={search}
      onSearchChange={setSearch}
      hideSearch
      hideHeader
    >
      <div className="page-container pt-0 pb-6">
        <BannerCarousel slides={SERVICES_BANNER_SLIDES} className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mb-6" />

        {/* Category Tabs Carousel */}
        <div className="relative mb-6 px-10 md:px-12">
          <button
            type="button"
            onClick={() => scrollCategories("left")}
            className={`hidden md:flex absolute left-0 top-[44px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-cement-200 dark:border-white/10 shadow-lg items-center justify-center text-cement-700 dark:text-zinc-200 hover:text-primary hover:scale-110 transition-all duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={categoryScrollRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-none py-4 px-2 scroll-smooth"
            role="tablist"
            aria-label="Service categories"
          >
            <div className="w-1.5 shrink-0" aria-hidden="true" />
            {SERVICE_CATEGORY_FILTERS.map((c) => {
              const meta = SERVICE_CATEGORY_META[c] ?? { emoji: "🛠️", image: null };
              const active = cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Filter by ${c}`}
                  onClick={() => setCat(c)}
                  className="group flex flex-col items-center gap-2 shrink-0 w-20 sm:w-24 focus:outline-none"
                >
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-2xl transition-all duration-300 ease-out border-2 p-1.5 ${
                      active
                        ? "bg-white dark:bg-zinc-800 border-primary shadow-md shadow-primary/20 ring-2 ring-primary/20"
                        : "bg-white dark:bg-zinc-900 border-cement-200 dark:border-white/10 group-hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`relative w-full h-full rounded-xl bg-slate-50 dark:bg-zinc-800/80 overflow-hidden flex items-center justify-center transition-transform duration-300 ${
                        active ? "scale-105" : "group-hover:scale-105"
                      }`}
                    >
                      {meta.image ? (
                        <ServiceCategoryImage src={meta.image} alt={c} emoji={meta.emoji} />
                      ) : (
                        <span className="text-3xl sm:text-4xl" aria-hidden="true">{meta.emoji}</span>
                      )}
                    </div>
                    {active && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md z-10">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs leading-tight text-center truncate w-full transition-colors ${
                      active
                        ? "text-primary font-bold"
                        : "text-cement-700 dark:text-zinc-300 font-medium group-hover:text-cement-900 dark:group-hover:text-white"
                    }`}
                  >
                    {c}
                  </span>
                </button>
              );
            })}
            <div className="w-1.5 shrink-0" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={() => scrollCategories("right")}
            className={`hidden md:flex absolute right-0 top-[44px] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-cement-200 dark:border-white/10 shadow-lg items-center justify-center text-cement-700 dark:text-zinc-200 hover:text-primary hover:scale-110 transition-all duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <p className="text-sm text-cement-500 dark:text-zinc-400">
            <span className="font-semibold text-cement-900 dark:text-white">{filtered.length}</span> service providers found
          </p>
          <DistrictAreaSearch
            district={district}
            onDistrictChange={setDistrict}
            area={area}
            onAreaChange={setArea}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search service, area, PIN…"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-card text-card-foreground rounded-3xl border border-border/80 dark:border-zinc-800 p-5 sm:p-6 shadow-[6px_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[6px_6px_25px_rgba(0,0,0,0.9)] hover:shadow-[8px_8px_25px_rgba(34,197,94,0.25)] dark:hover:shadow-[8px_8px_30px_rgba(74,222,128,0.35)] hover:border-primary/60 dark:hover:border-primary/60 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group/card"
            >
              <div>
                <div className="flex items-start gap-3.5 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                    {categoryIcon[s.category] ?? <Wrench className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-foreground dark:text-white text-base sm:text-lg truncate">{s.name}</h3>
                      {s.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                      <span className="text-[11px] font-extrabold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                        {s.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-extrabold text-foreground dark:text-white">{s.rating}</span>
                        <span className="text-zinc-500 dark:text-zinc-300">({s.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {formatLocationLine(s.area, s.district)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold">From</div>
                    <div className="font-extrabold text-primary text-sm sm:text-base">{s.priceFrom}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed mb-4 line-clamp-3 font-normal">
                  {s.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEnquiry(s.name)}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-[#5ee06a] hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                <Phone className="w-4 h-4 fill-current" /> Get Quote
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Wrench className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-600 dark:text-zinc-300 font-medium">No services found. Try a different filter.</p>
            </div>
          )}
        </div>
      </div>

      {enquiry && <EnquiryModal target={enquiry} onClose={() => setEnquiry(null)} />}
    </ListingPageShell>
  );
}
