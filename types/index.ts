// types/index.ts — Kattodam shared types

export type UserRole = "CUSTOMER" | "DEALER" | "BUILDER" | "ADMIN";
export type ListingType = "BUY" | "SELL" | "RENT";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";
export type EnquiryStatus = "NEW" | "READ" | "RESPONDED";
export type MaterialCategory =
  | "CEMENT"
  | "TMT_STEEL"
  | "BRICKS"
  | "SAND"
  | "AGGREGATES"
  | "PAINT"
  | "TILES"
  | "PLUMBING"
  | "ELECTRICAL"
  | "GLASS"
  | "WOOD"
  | "OTHER";

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Dealer {
  id: string;
  userId: string;
  shopName: string;
  description?: string;
  address: string;
  city: string;
  area: string;
  phone: string;
  whatsapp?: string;
  isVerified: boolean;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  materials?: DealerMaterial[];
  user?: User;
}

export interface DealerMaterial {
  id: string;
  dealerId: string;
  category: MaterialCategory;
  name: string;
  brand?: string;
  unit: string;
  priceMin?: number;
  priceMax?: number;
  description?: string;
  inStock: boolean;
  imageUrl?: string;
}

export interface Builder {
  id: string;
  userId: string;
  companyName: string;
  ownerName: string;
  type: "Builder" | "Architect" | "Contractor";
  description?: string;
  address: string;
  city: string;
  area: string;
  phone: string;
  experience: number;
  isVerified: boolean;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  projects?: BuilderProject[];
}

export interface BuilderProject {
  id: string;
  builderId: string;
  title: string;
  description?: string;
  location: string;
  completedAt?: Date;
  images: string[];
}

export interface Property {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: ListingType;
  status: ListingStatus;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  location: string;
  city: string;
  landmark?: string;
  images: string[];
  createdAt: Date;
  user?: User;
}

export interface Enquiry {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  dealerId?: string;
  builderId?: string;
  propertyId?: string;
  createdAt: Date;
  dealer?: Dealer;
  builder?: Builder;
  property?: Property;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender?: User;
  receiver?: User;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter types
export interface MaterialFilters {
  category?: MaterialCategory;
  area?: string;
  search?: string;
}

export interface BuilderFilters {
  type?: "Builder" | "Architect" | "Contractor";
  area?: string;
  search?: string;
}

export interface PropertyFilters {
  type?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  area?: string;
  search?: string;
}

// Material category display config
export const MATERIAL_CATEGORIES: Record<MaterialCategory, { label: string; icon: string }> = {
  CEMENT: { label: "Cement", icon: "🏗️" },
  TMT_STEEL: { label: "TMT Steel", icon: "🔩" },
  BRICKS: { label: "Bricks", icon: "🧱" },
  SAND: { label: "Sand", icon: "⛱️" },
  AGGREGATES: { label: "Aggregates", icon: "🪨" },
  PAINT: { label: "Paint", icon: "🎨" },
  TILES: { label: "Tiles", icon: "◼️" },
  PLUMBING: { label: "Plumbing", icon: "🔧" },
  ELECTRICAL: { label: "Electrical", icon: "⚡" },
  GLASS: { label: "Glass", icon: "🪟" },
  WOOD: { label: "Wood", icon: "🪵" },
  OTHER: { label: "Other", icon: "📦" },
};

export const COIMBATORE_AREAS = [
  "RS Puram",
  "Gandhipuram",
  "Peelamedu",
  "Saibaba Colony",
  "Race Course",
  "Singanallur",
  "Ganapathy",
  "Vadavalli",
  "Kuniyamuthur",
  "Kalapatti",
  "Thudiyalur",
  "Sundarapuram",
  "Kovaipudur",
  "Ondipudur",
  "Sulur",
];
