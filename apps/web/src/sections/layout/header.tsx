'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@libs/react-shared';
import { cn } from '@web/utils/cn';
import { Container } from '@web/components/ui/container';
import { Button } from '@web/components/ui/button';
import { Typography } from '@web/components/ui/typography';
import { Logo } from '@web/components/logo';
import { headerNavigation, authNavigation } from '@web/config/navigation.config';
import type { NavItem } from '@web/config/navigation.config';

interface HeaderProps {
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, currentUser, logout, isLoading, authUser } = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Track if component has mounted (for hydration safety)
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname?.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const toggleDropdown = (title: string) => {
        setActiveDropdown(activeDropdown === title ? null : title);
    };

    const renderNavItem = (item: NavItem, isMobile = false) => {
        const hasChildren = item.children && item.children.length > 0;
        const active = isActive(item.path);

        if (hasChildren) {
            return (
                <div
                    key={item.title}
                    className={cn('relative', isMobile ? 'w-full' : '')}
                    ref={!isMobile ? dropdownRef : null}
                >
                    <button
                        onClick={() => toggleDropdown(item.title)}
                        className={cn(
                            'flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors',
                            isMobile ? 'w-full justify-between text-left' : '',
                            active
                                ? 'text-primary bg-primary/10'
                                : 'text-text-primary hover:text-primary hover:bg-neutral-100'
                        )}
                    >
                        <span>{item.title}</span>
                        <ChevronDown
                            className={cn(
                                'w-4 h-4 transition-transform duration-200',
                                activeDropdown === item.title ? 'rotate-180' : ''
                            )}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.title && (
                        <div
                            className={cn(
                                isMobile
                                    ? 'mt-2 ml-4 space-y-1'
                                    : 'absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-[slideDown_0.2s_ease-out]'
                            )}
                        >
                            {item.children?.map((child) => (
                                <Link
                                    key={child.path}
                                    href={child.path}
                                    className={cn(
                                        'block px-4 py-3 transition-colors',
                                        isMobile
                                            ? 'rounded-lg hover:bg-neutral-100'
                                            : 'hover:bg-neutral-50',
                                        isActive(child.path) ? 'bg-primary/5 text-primary' : ''
                                    )}
                                >
                                    <span className="font-medium text-text-primary">{child.title}</span>
                                    {child.description && (
                                        <span className="block text-sm text-text-secondary mt-0.5">
                                            {child.description}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                key={item.path}
                href={item.path}
                className={cn(
                    'px-3 py-2 rounded-lg font-medium transition-colors',
                    isMobile ? 'block w-full' : '',
                    active
                        ? 'text-primary bg-primary/10'
                        : 'text-text-primary hover:text-primary hover:bg-neutral-100'
                )}
            >
                {item.title}
            </Link>
        );
    };

    return (
        <header
            className={cn(
                'sticky top-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200'
                    : 'bg-white',
                className
            )}
        >
            <Container>
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Logo className="h-8 md:h-10" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {headerNavigation.map((item) => renderNavItem(item))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        {!hasMounted || isLoading ? (
                            <div className="w-20 h-10 bg-neutral-100 animate-pulse rounded-lg" />
                        ) : isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => toggleDropdown('user-menu')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {currentUser?.firstName?.[0] || authUser?.email?.[0] || 'U'}
                                        </span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </button>

                                {activeDropdown === 'user-menu' && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-[slideDown_0.2s_ease-out]">
                                        <div className="px-4 py-3 border-b border-neutral-100">
                                            <Typography variant="body2" className="font-medium">
                                                {currentUser?.firstName} {currentUser?.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="text-secondary">
                                                {authUser?.email}
                                            </Typography>
                                        </div>
                                        <Link
                                            href={authNavigation.profile}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-text-secondary" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href={authNavigation.settings}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-text-secondary" />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="border-t border-neutral-100 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-error hover:bg-error/5 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    color="grey"
                                    href={authNavigation.login}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href={authNavigation.register}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </Container>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 md:top-20 z-40">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div
                        ref={mobileMenuRef}
                        className="absolute inset-x-0 top-0 bg-white shadow-xl border-t border-neutral-200 max-h-[calc(100vh-4rem)] overflow-y-auto animate-[slideDown_0.2s_ease-out]"
                    >
                        <Container>
                            <nav className="py-4 space-y-1">
                                {headerNavigation.map((item) => renderNavItem(item, true))}
                            </nav>

                            <div className="border-t border-neutral-200 py-4">
                                {isAuthenticated ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 px-3 py-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {currentUser?.firstName?.[0] || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <Typography variant="body2" className="font-medium">
                                                    {currentUser?.firstName} {currentUser?.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text-secondary">
                                                    {authUser?.email}
                                                </Typography>
                                            </div>
                                        </div>
                                        <Link
                                            href={authNavigation.profile}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100"
                                        >
                                            <User className="w-5 h-5 text-text-secondary" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href={authNavigation.settings}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100"
                                        >
                                            <Settings className="w-5 h-5 text-text-secondary" />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-error hover:bg-error/5"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            color="primary"
                                            fullWidth
                                            href={authNavigation.login}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            href={authNavigation.register}
                                        >
                                            Get Started
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Container>
                    </div>
                </div>
            )}
        </header>
    );
};
