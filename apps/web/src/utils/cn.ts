import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Standard cn function for Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(...inputs));
}
