"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  DISTRICTS,
  DISTRICT_FILTER_ALL,
  areaOptionsForDistrict,
  type AreaSearchOption,
} from "@/lib/mock-data";

type Props = {
  district: string;
  onDistrictChange: (district: string) => void;
  area: string;
  onAreaChange: (area: string) => void;
  /** Optional: pass search text + handler to render an integrated search input */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
};

export default function DistrictAreaSearch({
  district,
  onDistrictChange,
  area,
  onAreaChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search by name, area, PIN…",
  className = "flex flex-col sm:flex-row gap-2",
}: Props) {
  const areaOptions = areaOptionsForDistrict(district);
  const selectedArea = areaOptions.find((o) => o.value === area) ?? areaOptions[0]!;

  return (
    <div className={className}>
      {/* Integrated Search Input */}
      {onSearchChange !== undefined && (
        <div className="relative min-w-0 sm:min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400 dark:text-zinc-500" />
          <input
            type="search"
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="w-full bg-white dark:bg-white/5 border border-cement-200 dark:border-white/10 text-cement-900 dark:text-white placeholder-cement-400 dark:placeholder-zinc-500 rounded-lg pl-9 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
      )}
      <SearchSelect
        value={district}
        onChange={(v) => {
          onDistrictChange(v);
          onAreaChange("All Areas");
        }}
        options={[DISTRICT_FILTER_ALL, ...DISTRICTS].map((d) => ({
          value: d,
          label: d,
          searchText: d.toLowerCase(),
        }))}
        placeholder="Search district…"
        ariaLabel="District"
      />
      <SearchSelect
        value={selectedArea.value}
        displayLabel={selectedArea.label}
        onChange={onAreaChange}
        options={areaOptions}
        placeholder="Search area or PIN…"
        ariaLabel="Area or PIN code"
      />
    </div>
  );
}

type SearchSelectProps = {
  value: string;
  displayLabel?: string;
  onChange: (next: string) => void;
  options: readonly AreaSearchOption[];
  placeholder: string;
  disabled?: boolean;
  disabledTitle?: string;
  ariaLabel: string;
};

function SearchSelect({
  value,
  displayLabel,
  onChange,
  options,
  placeholder,
  disabled,
  disabledTitle,
  ariaLabel,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const shownLabel = displayLabel ?? options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const q = query.toLowerCase().trim();
  const filtered = q
    ? options.filter((o) => o.searchText.includes(q) || o.label.toLowerCase().includes(q))
    : options;

  return (
    <div ref={wrapRef} className="relative min-w-0 sm:min-w-[200px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400 dark:text-zinc-500" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          value={open ? query : shownLabel}
          placeholder={placeholder}
          disabled={disabled}
          title={disabled ? disabledTitle : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (disabled) return;
            setQuery("");
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-full bg-white dark:bg-white/5 border border-cement-200 dark:border-white/10 text-cement-900 dark:text-white placeholder-cement-400 dark:placeholder-zinc-500 rounded-lg pl-9 pr-8 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close" : "Open"}
          disabled={disabled}
          onMouseDown={(e) => {
            e.preventDefault();
            if (disabled) return;
            setQuery("");
            setOpen((o) => !o);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-cement-400 hover:text-cement-700 dark:text-zinc-500 dark:hover:text-zinc-300 disabled:cursor-not-allowed"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && !disabled ? (
        <div
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-zinc-900 border border-cement-200 dark:border-white/10 rounded-lg shadow-lg dark:shadow-black/40 py-1"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-cement-500 dark:text-zinc-400">No matches</div>
          ) : (
            filtered.map((opt) => {
              const selected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-cement-700 dark:text-zinc-300 hover:bg-cement-50 dark:hover:bg-white/5"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
