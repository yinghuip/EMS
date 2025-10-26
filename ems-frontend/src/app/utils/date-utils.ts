/**
 * Date utility functions for formatting and manipulating dates
 * Used across components for consistent date display
 */

/**
 * Format a date string to a readable format
 * @param dateString ISO date string (e.g., "2025-10-26T10:00:00Z")
 * @param options Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string (e.g., "Oct 26, 2025")
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  return new Date(dateString).toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Format a date range with smart display logic
 * @param startDateString Start date ISO string
 * @param endDateString End date ISO string
 * @returns Formatted date range (e.g., "Oct 26, 2025" or "Oct 26 – Oct 28, 2025")
 */
export function formatDateRange(startDateString: string, endDateString: string): string {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  // Same day event - show only one date
  if (startDate.toDateString() === endDate.toDateString()) {
    return formatDate(startDateString);
  }

  // Multi-day event - show range
  const startStr = formatDate(startDateString);
  const endStr = formatDate(endDateString);
  return `${startStr} – ${endStr}`;
}

/**
 * Get day of week from date string
 * @param dateString ISO date string
 * @returns Day name (e.g., "Monday", "Tue")
 */
export function getDayOfWeek(dateString: string, format: 'long' | 'short' = 'long'): string {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: format });
}

/**
 * Get month and year from date string
 * @param dateString ISO date string
 * @returns Month and year (e.g., "October 2025")
 */
export function getMonthYear(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format time from date string
 * @param dateString ISO date string
 * @returns Time string (e.g., "10:00 AM")
 */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Check if a date is in the past
 * @param dateString ISO date string
 * @returns true if date is before now
 */
export function isPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Check if a date is in the future
 * @param dateString ISO date string
 * @returns true if date is after now
 */
export function isFuture(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

/**
 * Get relative time description (e.g., "in 3 days", "2 weeks ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  if (diffDays >= 7 && diffDays < 14) return 'Next week';
  if (diffDays <= -7 && diffDays > -14) return 'Last week';
  
  return formatDate(dateString);
}
