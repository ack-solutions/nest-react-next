// Image assets
export { default as logoImage } from './image/logo.png';
export { default as logoSvg } from './image/logo.svg';
export { default as logoWhiteSvg } from './image/logo-white.svg';
export { default as avatarPlaceholder } from './image/avatar-placeholder.webp';
export { default as successImage } from './image/success.png';

const withBase = (p: string) =>
    `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

const cleanIso = (iso: string) => iso.trim().toLowerCase();
// Asset paths (for cases where you need the path string)
export const ASSETS = {
    images: {
        logo: '/assets/image/logo.png',
        logoSvg: '/assets/image/logo.svg',
        logoWhiteSvg: '/assets/image/logo-white.svg',
        avatarPlaceholder: '/assets/image/avatar-placeholder.webp',
        success: '/assets/image/success.png',
    },
    flags: {
        getFlag: (iso: string) =>
            withBase(`assets/flag-icons/${cleanIso(iso)}.webp`),
    },
} as const;
