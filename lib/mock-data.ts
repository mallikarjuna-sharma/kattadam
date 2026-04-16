// lib/mock-data.ts — Static mock data for all pages

export const DISTRICTS = ["Coimbatore", "Tirupur", "Erode", "Namakkal", "Salem"] as const;
export type District = (typeof DISTRICTS)[number];
export const DISTRICT_FILTER_ALL = "All Districts" as const;

/** Well-known localities per district (for filters & mock listings) */
export const DISTRICT_AREAS: Record<District, string[]> = {
  Coimbatore: [
    "RS Puram",
    "Gandhipuram",
    "Peelamedu",
    "Saibaba Colony",
    "Race Course",
    "Singanallur",
    "Ganapathy",
    "Vadavalli",
    "Kalapatti",
    "Sulur",
  ],
  Tirupur: [
    "Avinashi Road",
    "Dharapuram Road",
    "PN Road",
    "Kumaran Road",
    "Kongu Nagar",
    "Velampalayam",
    "Tirupur Town",
    "Palladam Road",
    "Uthukuli Road",
    "Collectorate",
  ],
  Erode: [
    "Erode Town",
    "Perundurai Road",
    "Chennimalai Road",
    "Kavundampalayam",
    "Chithode",
    "Bhavani",
    "Gobichettipalayam",
    "Modakurichi",
    "Ingur",
    "EVN Road",
  ],
  Namakkal: [
    "Namakkal Town",
    "Tiruchengode",
    "Rasipuram",
    "Paramathi-Velur",
    "Mohanur",
    "Komarapalayam",
    "Kumarapalayam",
    "Senthamangalam",
    "Namagiripettai",
    "Trichy Road",
  ],
  Salem: [
    "Fairlands",
    "Hasthampatti",
    "Ammapet",
    "Suramangalam",
    "Meyyanur",
    "Omalur",
    "Jagir",
    "Steel Plant Road",
    "Gugai",
    "Yercaud Road",
  ],
};

export function areaOptionsForDistrict(district: string): string[] {
  if (district === DISTRICT_FILTER_ALL) return ["All Areas"];
  const list = DISTRICT_AREAS[district as District];
  if (!list) return ["All Areas"];
  return ["All Areas", ...list];
}

/** Parse "Area, District" from API-style location strings */
export function parseLocationToAreaDistrict(
  location: string | null | undefined
): { area: string; district: District } {
  if (!location?.trim()) return { area: "Coimbatore", district: "Coimbatore" };
  const parts = location.split(",").map((s) => s.trim()).filter(Boolean);
  const last = parts[parts.length - 1]!;
  const district = (DISTRICTS as readonly string[]).includes(last) ? (last as District) : "Coimbatore";
  const area = parts.length >= 2 ? parts[0]! : last;
  return { area, district };
}

/** @deprecated Prefer `areaOptionsForDistrict` + `DISTRICT_AREAS` */
export const AREAS = ["All Areas", ...DISTRICT_AREAS.Coimbatore];

export const DEALERS = [
  {
    id: "1",
    shopName: "Sri Ram Cement Depot",
    district: "Coimbatore" as const,
    area: "RS Puram",
    rating: 4.8,
    reviewCount: 124,
    isVerified: true,
    categories: ["Cement", "Sand"],
    phone: "98765 43210",
    materials: [
      { name: "Ultratech OPC 53 Grade", price: "₹390/bag", inStock: true },
      { name: "Dalmia PPC Cement", price: "₹370/bag", inStock: true },
      { name: "River Sand", price: "₹1,800/tonne", inStock: false },
    ],
  },
  {
    id: "2",
    shopName: "Murugan Steel Traders",
    district: "Coimbatore" as const,
    area: "Gandhipuram",
    rating: 4.6,
    reviewCount: 89,
    isVerified: true,
    categories: ["TMT Steel"],
    phone: "97654 32109",
    materials: [
      { name: "JSW TMT Fe500", price: "₹59,500/tonne", inStock: true },
      { name: "TATA Tiscon Fe500D", price: "₹61,000/tonne", inStock: true },
      { name: "Vizag Steel TMT", price: "₹58,000/tonne", inStock: true },
    ],
  },
  {
    id: "3",
    shopName: "Coimbatore Bricks & Aggregates",
    district: "Coimbatore" as const,
    area: "Singanallur",
    rating: 4.3,
    reviewCount: 56,
    isVerified: false,
    categories: ["Bricks", "Aggregates", "Sand"],
    phone: "95432 10987",
    materials: [
      { name: "Country Bricks (1st quality)", price: "₹4,800/1000 pcs", inStock: true },
      { name: "20mm Aggregate", price: "₹1,300/tonne", inStock: true },
      { name: "M-Sand", price: "₹1,500/tonne", inStock: true },
    ],
  },
  {
    id: "4",
    shopName: "Lakshmi Paint & Hardware",
    district: "Coimbatore" as const,
    area: "Peelamedu",
    rating: 4.5,
    reviewCount: 201,
    isVerified: true,
    categories: ["Paint", "Tiles", "Hardware"],
    phone: "94321 09876",
    materials: [
      { name: "Asian Paints Apex Exterior", price: "₹320/litre", inStock: true },
      { name: "Kajaria Floor Tiles 600x600", price: "₹85/sq.ft", inStock: true },
      { name: "Berger WeatherCoat", price: "₹290/litre", inStock: false },
    ],
  },
  {
    id: "5",
    shopName: "Vel Electrical Stores",
    district: "Coimbatore" as const,
    area: "Saibaba Colony",
    rating: 4.7,
    reviewCount: 143,
    isVerified: true,
    categories: ["Electrical", "Plumbing"],
    phone: "93210 98765",
    materials: [
      { name: "Havells 2.5mm Wire (90m)", price: "₹2,200/roll", inStock: true },
      { name: "Finolex PVC Pipe 1\"", price: "₹380/piece", inStock: true },
      { name: "Legrand Switch Plate", price: "₹450/unit", inStock: true },
    ],
  },
  {
    id: "6",
    shopName: "Kongu Cement & Steel Mart",
    district: "Tirupur" as const,
    area: "Avinashi Road",
    rating: 4.5,
    reviewCount: 72,
    isVerified: true,
    categories: ["Cement", "TMT Steel"],
    phone: "92109 87654",
    materials: [
      { name: "Ramco Super Grade Cement", price: "₹385/bag", inStock: true },
      { name: "JSW Neosteel Fe550", price: "₹60,200/tonne", inStock: true },
    ],
  },
  {
    id: "7",
    shopName: "Bhavani River Sand & Blue Metal",
    district: "Erode" as const,
    area: "Bhavani",
    rating: 4.4,
    reviewCount: 38,
    isVerified: true,
    categories: ["Sand", "Aggregates"],
    phone: "91098 76543",
    materials: [
      { name: "River Sand (Bhavani)", price: "₹1,750/tonne", inStock: true },
      { name: "40mm Jelly", price: "₹1,250/tonne", inStock: true },
    ],
  },
  {
    id: "8",
    shopName: "Namakkal TMT & Roofing",
    district: "Namakkal" as const,
    area: "Namakkal Town",
    rating: 4.6,
    reviewCount: 51,
    isVerified: true,
    categories: ["TMT Steel"],
    phone: "90087 65432",
    materials: [
      { name: "SAIL TMT Fe500", price: "₹58,800/tonne", inStock: true },
      { name: "Roofing Sheets (JSW Colouron)", price: "₹95/sq.ft", inStock: true },
    ],
  },
  {
    id: "9",
    shopName: "Salem Fairlands Paints",
    district: "Salem" as const,
    area: "Fairlands",
    rating: 4.5,
    reviewCount: 88,
    isVerified: false,
    categories: ["Paint", "Hardware"],
    phone: "89976 54321",
    materials: [
      { name: "Nippon Paint Sumo", price: "₹310/litre", inStock: true },
      { name: "Asian Tractor Emulsion", price: "₹180/litre", inStock: true },
    ],
  },
];

export const BUILDERS = [
  {
    id: "1",
    companyName: "Shree Constructions",
    ownerName: "Rajesh Kumar",
    type: "Builder",
    district: "Coimbatore" as const,
    area: "RS Puram",
    experience: 15,
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    phone: "98765 11223",
    description:
      "Specialising in residential villas and apartments. 200+ projects delivered across western Tamil Nadu with on-time completion guarantee.",
    tags: ["Villas", "Apartments", "Renovation"],
    projects: [
      { title: "Greenfield Villa, Peelamedu", year: 2023, sqft: 2400 },
      { title: "Sky Apartments, RS Puram", year: 2022, sqft: 12000 },
    ],
  },
  {
    id: "2",
    companyName: "Design Arc Studio",
    ownerName: "Priya Suresh",
    type: "Architect",
    district: "Coimbatore" as const,
    area: "Race Course",
    experience: 10,
    rating: 4.8,
    reviewCount: 63,
    isVerified: true,
    phone: "97654 22334",
    description: "Award-winning architecture firm focused on modern, sustainable design. From concept to completion.",
    tags: ["Modern", "Sustainable", "Commercial"],
    projects: [
      { title: "Eco Home, Vadavalli", year: 2023, sqft: 1800 },
      { title: "Retail Hub, Gandhipuram", year: 2022, sqft: 5500 },
    ],
  },
  {
    id: "3",
    companyName: "AK Civil Works",
    ownerName: "Anand Krishnamurthy",
    type: "Engineer",
    district: "Coimbatore" as const,
    area: "Singanallur",
    experience: 8,
    rating: 4.4,
    reviewCount: 41,
    isVerified: true,
    phone: "94321 33445",
    description: "Civil contractor for residential construction, compound walls, flooring, and interior finishing works.",
    tags: ["Civil Works", "Flooring", "Finishing"],
    projects: [
      { title: "Row Houses, Sulur", year: 2023, sqft: 6000 },
      { title: "Individual Villa, Kalapatti", year: 2023, sqft: 2200 },
    ],
  },
  {
    id: "4",
    companyName: "Vega Interiors",
    ownerName: "Meena Ravi",
    type: "Architect",
    district: "Coimbatore" as const,
    area: "Peelamedu",
    experience: 12,
    rating: 4.7,
    reviewCount: 95,
    isVerified: true,
    phone: "93210 44556",
    description: "Interior design and architecture studio. Turnkey interior solutions for homes, offices, and retail spaces.",
    tags: ["Interior", "Turnkey", "Office"],
    projects: [
      { title: "Tech Office, Peelamedu", year: 2024, sqft: 3200 },
      { title: "Luxury Flat Interior, Race Course", year: 2023, sqft: 1600 },
    ],
  },
  {
    id: "5",
    companyName: "Kongu Build Tech",
    ownerName: "Karthik Selvam",
    type: "Builder",
    district: "Tirupur" as const,
    area: "Kumaran Road",
    experience: 12,
    rating: 4.6,
    reviewCount: 44,
    isVerified: true,
    phone: "92111 22333",
    description: "Industrial sheds, knitwear factory buildings, and residential layouts along Avinashi–Tirupur corridor.",
    tags: ["Industrial", "Factory", "Residential"],
    projects: [
      { title: "Textile Unit, Velampalayam", year: 2024, sqft: 18000 },
      { title: "Gated community, PN Road", year: 2023, sqft: 45000 },
    ],
  },
  {
    id: "6",
    companyName: "Salem Heights Developers",
    ownerName: "Vignesh Pandian",
    type: "Builder",
    district: "Salem" as const,
    area: "Hasthampatti",
    experience: 14,
    rating: 4.7,
    reviewCount: 56,
    isVerified: true,
    phone: "91555 33444",
    description: "Premium apartments and plotted developments in Salem — Fairlands to Suramangalam.",
    tags: ["Apartments", "Plots", "Gated"],
    projects: [
      { title: "Skyline Towers, Fairlands", year: 2024, sqft: 85000 },
      { title: "Lakeview Villas, Yercaud Road", year: 2023, sqft: 12000 },
    ],
  },
];

export type PropertyListingSubtype = "Flat" | "Plot" | "Empty land";

export const PROPERTIES = [
  {
    id: "1",
    title: "3BHK Apartment — Peelamedu",
    type: "SELL",
    listingSubtype: "Flat" as PropertyListingSubtype,
    price: 6500000,
    area: 1450,
    bedrooms: 3,
    bathrooms: 2,
    district: "Coimbatore" as const,
    location: "Peelamedu, Coimbatore",
    postedBy: "Suresh R",
    daysAgo: 2,
    tag: "New",
  },
  {
    id: "2",
    title: "2BHK Flat for Rent — RS Puram",
    type: "RENT",
    listingSubtype: "Flat" as PropertyListingSubtype,
    price: 14000,
    area: 1050,
    bedrooms: 2,
    bathrooms: 2,
    district: "Coimbatore" as const,
    location: "RS Puram, Coimbatore",
    postedBy: "Kavitha M",
    daysAgo: 1,
    tag: "Hot",
  },
  {
    id: "3",
    title: "Commercial Land — Sulur",
    type: "SELL",
    listingSubtype: "Plot" as PropertyListingSubtype,
    price: 2200000,
    area: 3600,
    bedrooms: null,
    bathrooms: null,
    district: "Coimbatore" as const,
    location: "Sulur, Coimbatore",
    postedBy: "Bala K",
    daysAgo: 5,
    tag: null,
  },
  {
    id: "4",
    title: "Independent House — Saibaba Colony",
    type: "SELL",
    listingSubtype: "Flat" as PropertyListingSubtype,
    price: 9800000,
    area: 2200,
    bedrooms: 4,
    bathrooms: 3,
    district: "Coimbatore" as const,
    location: "Saibaba Colony, Coimbatore",
    postedBy: "Anita S",
    daysAgo: 3,
    tag: null,
  },
  {
    id: "5",
    title: "Empty land for lease — Kinathukadavu corridor",
    type: "RENT",
    listingSubtype: "Empty land" as PropertyListingSubtype,
    price: 45000,
    area: 12000,
    bedrooms: null,
    bathrooms: null,
    district: "Coimbatore" as const,
    location: "Kinathukadavu, Coimbatore",
    postedBy: "Ravi T",
    daysAgo: 7,
    tag: null,
  },
  {
    id: "6",
    title: "Residential Plot — Kalapatti",
    type: "SELL",
    listingSubtype: "Plot" as PropertyListingSubtype,
    price: 3500000,
    area: 2400,
    bedrooms: null,
    bathrooms: null,
    district: "Coimbatore" as const,
    location: "Kalapatti, Coimbatore",
    postedBy: "Mani P",
    daysAgo: 10,
    tag: null,
  },
  {
    id: "7",
    title: "2BHK near Collectorate — Tirupur",
    type: "RENT",
    listingSubtype: "Flat" as PropertyListingSubtype,
    price: 12000,
    area: 950,
    bedrooms: 2,
    bathrooms: 2,
    district: "Tirupur" as const,
    location: "Collectorate, Tirupur",
    postedBy: "Divya N",
    daysAgo: 4,
    tag: "New",
  },
  {
    id: "8",
    title: "Individual House — Perundurai Road",
    type: "SELL",
    listingSubtype: "Flat" as PropertyListingSubtype,
    price: 7200000,
    area: 1800,
    bedrooms: 3,
    bathrooms: 3,
    district: "Erode" as const,
    location: "Perundurai Road, Erode",
    postedBy: "Senthil K",
    daysAgo: 6,
    tag: null,
  },
  {
    id: "9",
    title: "3BHK Apartment — Fairlands",
    type: "SELL",
    listingSubtype: "Flat" as PropertyListingSubtype,
    price: 5800000,
    area: 1320,
    bedrooms: 3,
    bathrooms: 2,
    district: "Salem" as const,
    location: "Fairlands, Salem",
    postedBy: "Latha P",
    daysAgo: 3,
    tag: "Hot",
  },
];

export const MATERIAL_CATEGORIES = [
  { key: "CEMENT", label: "Cement", emoji: "🏗️" },
  { key: "TMT_STEEL", label: "TMT Steel", emoji: "🔩" },
  { key: "BRICKS", label: "Bricks", emoji: "🧱" },
  { key: "SAND", label: "Sand", emoji: "⛱️" },
  { key: "AGGREGATES", label: "Aggregates", emoji: "🪨" },
  { key: "PAINT", label: "Paint", emoji: "🎨" },
  { key: "TILES", label: "Tiles", emoji: "◼️" },
  { key: "PLUMBING", label: "Plumbing", emoji: "🔧" },
  { key: "ELECTRICAL", label: "Electrical", emoji: "⚡" },
];

/** Category keys that use a fixed subcategory dropdown in admin (others use free-text subcategory). */
export const MATERIAL_SUBCATEGORY_PRESETS: Record<string, readonly { value: string; label: string }[]> = {
  CEMENT: [
    { value: "OPC", label: "OPC" },
    { value: "PPC", label: "PPC" },
  ],
  TMT_STEEL: [
    { value: "8 mm", label: "8 mm" },
    { value: "10 mm", label: "10 mm" },
  ],
  PAINT: [
    { value: "interior", label: "Interior" },
    { value: "exterior", label: "Exterior" },
  ],
};

export function materialCategoryUsesSubcategoryDropdown(categoryKey: string): boolean {
  return Object.prototype.hasOwnProperty.call(MATERIAL_SUBCATEGORY_PRESETS, categoryKey);
}

export function materialCategoryLabel(categoryKey: string): string {
  return MATERIAL_CATEGORIES.find((c) => c.key === categoryKey)?.label ?? categoryKey.replace(/_/g, " ");
}

export const SERVICE_CATEGORY_FILTERS = [
  "All",
  "Interiors",
  "Renovations",
  "Painting",
  "Electrical",
  "Plumbing",
  "Masonry works",
] as const;

export const SERVICES = [
  {
    id: "1",
    name: "Vel Electrical Works",
    category: "Electrical",
    district: "Coimbatore" as const,
    area: "Gandhipuram",
    rating: 4.7,
    reviewCount: 112,
    isVerified: true,
    description:
      "Licensed electrical contractor for residential and commercial wiring, panel upgrades, and safety audits.",
    tags: ["Wiring", "Panel Upgrade", "Safety Audit"],
    priceFrom: "₹500/hr",
  },
  {
    id: "2",
    name: "AK Plumbing Solutions",
    category: "Plumbing",
    district: "Coimbatore" as const,
    area: "RS Puram",
    rating: 4.5,
    reviewCount: 78,
    isVerified: true,
    description:
      "Expert plumbing for new construction, bathroom fittings, pipeline repairs, and water tank installation.",
    tags: ["Pipeline", "Bathroom Fittings", "Water Tank"],
    priceFrom: "₹400/hr",
  },
  {
    id: "3",
    name: "Dream Interior Studio",
    category: "Interiors",
    district: "Coimbatore" as const,
    area: "Peelamedu",
    rating: 4.8,
    reviewCount: 95,
    isVerified: true,
    description:
      "Full interior design and execution — modular kitchens, false ceilings, wardrobes, and complete home interiors.",
    tags: ["Modular Kitchen", "False Ceiling", "Wardrobes"],
    priceFrom: "₹800/sq.ft",
  },
  {
    id: "4",
    name: "Coimbatore Painting Works",
    category: "Painting",
    district: "Coimbatore" as const,
    area: "Singanallur",
    rating: 4.3,
    reviewCount: 64,
    isVerified: false,
    description: "Interior and exterior painting, texture finishes, waterproofing, and wall putty application.",
    tags: ["Interior Paint", "Exterior Paint", "Texture"],
    priceFrom: "₹12/sq.ft",
  },
  {
    id: "5",
    name: "Ravi Civil & Masonry",
    category: "Masonry works",
    district: "Coimbatore" as const,
    area: "Kalapatti",
    rating: 4.4,
    reviewCount: 48,
    isVerified: true,
    description: "Masonry, brickwork, compound walls, flooring, and tile fixing for residential projects.",
    tags: ["Masonry", "Flooring", "Tile Fixing"],
    priceFrom: "₹350/hr",
  },
  {
    id: "6",
    name: "Tirupur Pipe & Sanitary",
    category: "Plumbing",
    district: "Tirupur" as const,
    area: "PN Road",
    rating: 4.5,
    reviewCount: 41,
    isVerified: true,
    description: "CP fittings, overhead tanks, and industrial plumbing for textile units.",
    tags: ["CP Fittings", "Industrial", "Repairs"],
    priceFrom: "₹450/hr",
  },
  {
    id: "10",
    name: "Kovai Renovation Hub",
    category: "Renovations",
    district: "Coimbatore" as const,
    area: "Saibaba Colony",
    rating: 4.6,
    reviewCount: 52,
    isVerified: true,
    description: "Structural repairs, bathroom remodelling, flooring upgrades, and full flat renovation packages.",
    tags: ["Remodelling", "Structural", "Turnkey"],
    priceFrom: "₹650/sq.ft",
  },
];

export function formatPrice(price: number, type?: string): string {
  if (type === "RENT") return `₹${price.toLocaleString()}/mo`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString()}`;
}
