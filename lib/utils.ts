// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price}`;
}

export function formatPriceRange(min?: number, max?: number, unit?: string): string {
  if (!min && !max) return "Price on request";
  const suffix = unit ? `/${unit}` : "";
  if (min && max) return `₹${min.toLocaleString()} – ₹${max.toLocaleString()}${suffix}`;
  if (min) return `From ₹${min.toLocaleString()}${suffix}`;
  return `Up to ₹${max!.toLocaleString()}${suffix}`;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function maskPhone(phone: string): string {
  return phone.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export const COIMBATORE_AREAS = [
  "RS Puram", "Gandhipuram", "Peelamedu", "Saibaba Colony",
  "Race Course", "Singanallur", "Ganapathy", "Vadavalli",
  "Kuniyamuthur", "Kalapatti", "Thudiyalur", "Sundarapuram",
  "Kovaipudur", "Ondipudur", "Sulur",
];
