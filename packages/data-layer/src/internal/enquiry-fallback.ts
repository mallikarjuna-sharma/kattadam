/** When true, enquiries are persisted under `.data/enquiries.json` if Supabase is missing or fails. */
export function useLocalEnquiryFallback(): boolean {
  const flag = process.env.ENQUIRY_LOCAL_FALLBACK?.trim();
  if (flag === "0" || flag === "false") return false;
  if (flag === "1" || flag === "true") return true;
  return process.env.NODE_ENV === "development";
}
