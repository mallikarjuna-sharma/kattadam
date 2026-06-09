import { areasForPinQuery, pinCodeForArea } from "@/lib/mock-data";

export function matchesAreaFilter(selectedArea: string, itemArea: string | null | undefined): boolean {
  if (selectedArea === "All Areas") return true;
  return (itemArea ?? "") === selectedArea;
}

/** Match free-text search against listing fields and PIN codes. */
export function matchesLocationSearch(
  query: string,
  itemArea: string | null | undefined,
  textFields: string[] = []
): boolean {
  const q = query.trim();
  if (!q) return true;

  const lower = q.toLowerCase();
  if (textFields.some((f) => f.toLowerCase().includes(lower))) return true;

  const area = itemArea ?? "";
  if (area.toLowerCase().includes(lower)) return true;

  const pin = pinCodeForArea(area);
  if (pin?.includes(q)) return true;

  if (/^\d+$/.test(q)) {
    const pinAreas = areasForPinQuery(q);
    if (pinAreas.length > 0) return pinAreas.includes(area);
  }

  return false;
}
