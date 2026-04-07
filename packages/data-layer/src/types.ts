export type UserRole = "customer" | "dealer" | "service_provider" | "super_admin" | "staff_admin";

export type UserStatus = "pending" | "approved" | "rejected" | "blocked" | "active";

export type DealerStatus = "pending" | "approved" | "rejected";

export type EnquiryStatus = "pending" | "assigned" | "accepted" | "delivered" | "cancelled";

export type MaterialPricingType = "fixed" | "dealer_quote";

export type NotificationAudience = "all" | "dealers" | "customers";

export interface UserRecord {
  id: string;
  name: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  location: string | null;
  lat: number | null;
  lng: number | null;
  kycStatus: string | null;
  createdAt: string;
}

export interface DealerRecord {
  id: string;
  userId: string | null;
  shopName: string;
  ownerName: string | null;
  phone: string | null;
  materials: string[];
  location: string | null;
  lat: number | null;
  lng: number | null;
  rating: number;
  verified: boolean;
  enabled: boolean;
  topDealer: boolean;
  status: DealerStatus;
  gstDocUrl: string | null;
  licenseDocUrl: string | null;
  createdAt: string;
}

export interface MaterialRecord {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  unit: string | null;
  imageUrl: string | null;
  pricingType: MaterialPricingType;
  fixedPrice: number | null;
  createdAt: string;
}

export interface EnquiryRecord {
  id: string;
  customerId: string | null;
  customerName: string | null;
  materialId: string | null;
  materialLabel: string | null;
  quantity: number | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  status: EnquiryStatus;
  assignedDealerId: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ReviewRecord {
  id: string;
  userId: string;
  dealerId: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  complaint: boolean;
  createdAt: string;
}

export interface ZoneRecord {
  id: string;
  name: string;
  notes: string | null;
  createdAt: string;
}

export interface NotificationBroadcastRecord {
  id: string;
  audience: NotificationAudience;
  title: string;
  body: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalUsers: number;
  totalDealers: number;
  activeDealers: number;
  pendingApprovals: number;
  totalEnquiries: number;
  enquiriesLast7Days: { date: string; count: number }[];
  weeklyUserGrowth: { weekStart: string; count: number }[];
}
