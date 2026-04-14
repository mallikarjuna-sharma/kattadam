"use client";

import { DISTRICTS, DISTRICT_FILTER_ALL, areaOptionsForDistrict } from "@/lib/mock-data";

type Props = {
  district: string;
  onDistrictChange: (district: string) => void;
  area: string;
  onAreaChange: (area: string) => void;
  className?: string;
  selectClassName?: string;
};

const baseSelect =
  "text-sm border border-earth-200 rounded-lg px-3 py-1.5 bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-brand-400 min-w-0";

export default function DistrictAreaSelect({
  district,
  onDistrictChange,
  area,
  onAreaChange,
  className = "flex flex-wrap items-center justify-end gap-2",
  selectClassName = baseSelect,
}: Props) {
  const areaOptions = areaOptionsForDistrict(district);

  return (
    <div className={className}>
      <select
        className={selectClassName}
        value={district}
        onChange={(e) => {
          const next = e.target.value;
          onDistrictChange(next);
          onAreaChange("All Areas");
        }}
        aria-label="District"
      >
        <option value={DISTRICT_FILTER_ALL}>All districts</option>
        {DISTRICTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        className={selectClassName}
        value={areaOptions.includes(area) ? area : "All Areas"}
        onChange={(e) => onAreaChange(e.target.value)}
        disabled={district === DISTRICT_FILTER_ALL}
        aria-label="Area"
        title={district === DISTRICT_FILTER_ALL ? "Choose a district to filter by area" : undefined}
      >
        {areaOptions.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
