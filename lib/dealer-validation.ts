import { DISTRICTS } from "@/lib/mock-data";

const MAX_ADDRESS_LEN = 500;
const MAX_LOCATION_LEN = 200;
const MAX_SHOP_NAME_LEN = 120;
const MAX_NAME_LEN = 80;

export type DealerFormValues = {
  shopName: string;
  ownerName: string;
  phone: string;
  district: string;
  area: string;
  location: string;
  residentialAddress: string;
  deliveryAddress: string;
  categories: string[];
};

export type DealerValidationResult = { ok: true } | { ok: false; error: string };

export function validateDealerForm(values: DealerFormValues): DealerValidationResult {
  const shopName = values.shopName.trim();
  if (!shopName) return { ok: false, error: "Shop name is required." };
  if (shopName.length > MAX_SHOP_NAME_LEN) {
    return { ok: false, error: `Shop name must be at most ${MAX_SHOP_NAME_LEN} characters.` };
  }

  const ownerName = values.ownerName.trim();
  if (!ownerName) return { ok: false, error: "Owner name is required." };
  if (ownerName.length > MAX_NAME_LEN) {
    return { ok: false, error: `Owner name must be at most ${MAX_NAME_LEN} characters.` };
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) return { ok: false, error: "Phone number must be at least 10 digits." };
  if (phoneDigits.length > 15) return { ok: false, error: "Phone number is too long." };

  const district = values.district.trim();
  if (!district) return { ok: false, error: "District is required." };
  if (!(DISTRICTS as readonly string[]).includes(district)) {
    return { ok: false, error: "Please select a valid district." };
  }

  const area = values.area.trim();
  if (!area) return { ok: false, error: "Area is required." };

  const location = values.location.trim();
  if (location.length > MAX_LOCATION_LEN) {
    return { ok: false, error: `Location must be at most ${MAX_LOCATION_LEN} characters.` };
  }

  const residentialAddress = values.residentialAddress.trim();
  if (residentialAddress.length > MAX_ADDRESS_LEN) {
    return { ok: false, error: `Residential address must be at most ${MAX_ADDRESS_LEN} characters.` };
  }

  const deliveryAddress = values.deliveryAddress.trim();
  if (deliveryAddress.length > MAX_ADDRESS_LEN) {
    return { ok: false, error: `Delivery address must be at most ${MAX_ADDRESS_LEN} characters.` };
  }

  if (values.categories.length === 0) {
    return { ok: false, error: "Select at least one material category." };
  }

  return { ok: true };
}

export function defaultLocationLine(area: string, district: string): string {
  const a = area.trim();
  const d = district.trim();
  if (a && d) return `${a}, ${d}`;
  return a || d;
}
