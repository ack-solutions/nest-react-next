/**
 * Phone number formatting utility
 *
 * Note: react-phone-number-input is not compatible with React 19.
 * This is a simple fallback implementation.
 */

export function toFormattedPhone(phoneNumber: string): string {
    if (!phoneNumber) return '';

    // Simple formatting: just return the phone number as-is
    // In production, you may want to use a lightweight library like libphonenumber-js
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Basic US format (xxx) xxx-xxxx
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    // With country code +x (xxx) xxx-xxxx
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    // International format with +
    if (phoneNumber.startsWith('+')) {
        return phoneNumber;
    }

    return phoneNumber;
}
