import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions

/**
 * Format currency in AED
 */
export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1000000) {
      return `AED ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `AED ${(amount / 1000).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date in a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-AE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Calculate days until expiry
 */
export function daysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if a listing is expired
 */
export function isListingExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  return daysUntilExpiry(expiryDate) <= 0;
}

/**
 * Mask sensitive information
 */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
}

/**
 * Mask phone number
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4) + lastFour;
  return masked;
}

/**
 * Generate a unique ID (simple implementation)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate UAE phone number
 */
export function validateUAEPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // UAE numbers start with 971 or 0 and are 9-12 digits
  return /^(971|0)?[0-9]{9}$/.test(cleaned);
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get financial means display text
 */
export function getFinancialMeansLabel(means: string): string {
  const labels: Record<string, string> = {
    '<100k': 'Under AED 100,000',
    '100k-1M': 'AED 100,000 - 1,000,000',
    '>1M': 'Over AED 1,000,000',
  };
  return labels[means] || means;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'var(--color-success)',
    pending: 'var(--color-warning)',
    expired: 'var(--color-error)',
    draft: 'var(--color-text-light)',
    new: 'var(--color-accent)',
    contacted: 'var(--color-warning)',
    closed: 'var(--color-success)',
  };
  return colors[status] || 'var(--color-text)';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}