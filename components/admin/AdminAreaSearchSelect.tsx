"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { areaOptionsForDistrict, type AreaSearchOption } from "@/lib/mock-data";

type Props = {
  district: string;
  value: string;
  onChange: (area: string) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
};

export default function AdminAreaSearchSelect({
  district,
  value,
  onChange,
  disabled,
  required,
  id,
}: Props) {
  const options = areaOptionsForDistrict(district).filter((o) => o.value !== "All Areas");
  const selected = options.find((o) => o.value === value);

  return (
    <SearchSelect
      id={id}
      value={value}
      displayLabel={selected?.label ?? value}
      onChange={onChange}
      options={options}
      placeholder={district ? "Search area or PIN…" : "Choose district first"}
      disabled={disabled || !district}
      disabledTitle={!district ? "Select a district first" : undefined}
      ariaLabel="Area"
      required={required}
    />
  );
}

type SearchSelectProps = {
  id?: string;
  value: string;
  displayLabel?: string;
  onChange: (next: string) => void;
  options: readonly AreaSearchOption[];
  placeholder: string;
  disabled?: boolean;
  disabledTitle?: string;
  ariaLabel: string;
  required?: boolean;
};

function SearchSelect({
  id,
  value,
  displayLabel,
  onChange,
  options,
  placeholder,
  disabled,
  disabledTitle,
  ariaLabel,
  required,
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
    <div ref={wrapRef} className="relative min-w-0">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          aria-required={required}
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
          className="admin-input pl-9 pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-cement-400 hover:text-cement-700 disabled:cursor-not-allowed"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && !disabled ? (
        <div
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-cement-200 rounded-lg shadow-lg py-1"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-cement-500">No matches</div>
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
                      ? "bg-brand-50 text-brand-700 font-medium"
                      : "text-cement-700 hover:bg-cement-50"
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
