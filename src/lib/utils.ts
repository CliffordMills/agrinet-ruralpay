import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "GHS"): string {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GH", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} MT`;
  return `${kg.toFixed(2)} kg`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("233")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+233${cleaned.slice(1)}`;
  return `+233${cleaned}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function generateReference(prefix: string = "TXN"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function creditScoreCategory(score: number): "poor" | "fair" | "good" | "excellent" {
  if (score < 300) return "poor";
  if (score < 500) return "fair";
  if (score < 700) return "good";
  return "excellent";
}
