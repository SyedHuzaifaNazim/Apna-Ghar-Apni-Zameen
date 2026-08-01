import type { AreaUnit } from '@/types/property';

/**
 * Single source of truth for user-facing formatting.
 *
 * Price and area formatting previously existed in three places
 * (PropertyCard, FilterModal, constants/Config) with inconsistent output —
 * "Rs 1.5 Lac" vs "Rs 1.5L" for the same number.
 */

const CRORE = 10_000_000;
const LAKH = 100_000;

/** Pakistani price shorthand: 25000000 -> "Rs 2.5 Cr". */
export const formatPrice = (amount: number): string => {
  if (!Number.isFinite(amount) || amount <= 0) return 'Price on request';

  if (amount >= CRORE) {
    return `Rs ${trimZero(amount / CRORE)} Cr`;
  }
  if (amount >= LAKH) {
    return `Rs ${trimZero(amount / LAKH)} Lac`;
  }
  if (amount >= 1_000) {
    return `Rs ${trimZero(amount / 1_000)}K`;
  }
  return `Rs ${amount.toLocaleString('en-PK')}`;
};

/** Adds a per-month suffix for rentals. */
export const formatPriceWithPeriod = (amount: number, listingType: string): string => {
  const base = formatPrice(amount);
  return listingType === 'For Rent' || listingType === 'Short Term Rent' ? `${base}/mo` : base;
};

const AREA_UNIT_LABEL: Record<AreaUnit, string> = {
  sqft: 'sq ft',
  'sq-yard': 'sq yd',
  acre: 'acre',
  kanal: 'kanal',
  marla: 'marla',
};

export const formatArea = (size: number, unit: AreaUnit): string => {
  if (!Number.isFinite(size) || size <= 0) return '—';
  const label = AREA_UNIT_LABEL[unit] ?? unit;
  const plural = size !== 1 && (unit === 'acre' || unit === 'kanal' || unit === 'marla') ? 's' : '';
  return `${size.toLocaleString('en-PK')} ${label}${plural}`;
};

/** "3 days ago", "Today", "12 Mar 2025". */
export const formatRelativeDate = (iso: string): string => {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';

  const days = Math.floor((Date.now() - then) / 86_400_000);

  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  return new Date(then).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/** Compact bed/bath summary, omitting zeros (commercial units have no beds). */
export const formatBedBath = (bedrooms: number, bathrooms: number): string => {
  const parts: string[] = [];
  if (bedrooms > 0) parts.push(`${bedrooms} Bed${bedrooms === 1 ? '' : 's'}`);
  if (bathrooms > 0) parts.push(`${bathrooms} Bath${bathrooms === 1 ? '' : 's'}`);
  return parts.join(' · ');
};

const trimZero = (value: number): string => {
  const fixed = value.toFixed(1);
  return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
};
