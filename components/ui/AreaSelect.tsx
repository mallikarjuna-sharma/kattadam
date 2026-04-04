"use client";

import { AREAS } from "@/lib/mock-data";

type Props = {
  value: string;
  onChange: (area: string) => void;
  className?: string;
};

export default function AreaSelect({
  value,
  onChange,
  className = "text-sm border border-earth-200 rounded-lg px-3 py-1.5 bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-brand-400",
}: Props) {
  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      {AREAS.map((a) => (
        <option key={a}>{a}</option>
      ))}
    </select>
  );
}
