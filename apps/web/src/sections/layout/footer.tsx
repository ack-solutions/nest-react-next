'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@web/utils/cn';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';
import { Logo } from '@web/components/logo';
import { footerNavigation, socialLinks, siteConfig } from '@web/config/navigation.config';

interface FooterProps {
    className?: string;
}

const socialIcons: Record<string, React.ReactNode> = {
    twitter: <Twitter className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    github: <Github className="w-5 h-5" />,
};

export const Footer: React.FC<FooterProps> = ({ className }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={cn('bg-neutral-900 text-white', className)}>
            {/* Main Footer Content */}
            <div className="section-py">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="inline-block mb-6">
                                <Logo className="h-10 brightness-0 invert" />
                            </Link>
                            <Typography variant="body2" className="text-neutral-400 mb-6 max-w-sm">
                                {siteConfig.description}
                            </Typography>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <a
                                    href="mailto:info@yourcompany.com"
                                    className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">info@yourcompany.com</span>
                                </a>
                                <a
                                    href="tel:+1234567890"
                                    className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm">+1 (234) 567-890</span>
                                </a>
                                <div className="flex items-start gap-3 text-neutral-400">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span className="text-sm">
                                        123 Business Street,<br />
                                        City, State 12345
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        {footerNavigation.map((section) => (
                            <div key={section.title}>
                                <Typography
                                    variant="body2"
                                    className="font-semibold text-white mb-4 uppercase tracking-wider text-xs"
                                >
                                    {section.title}
                                </Typography>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.path}>
                                            <Link
                                                href={link.path}
                                                className="text-sm text-neutral-400 hover:text-white transition-colors inline-block"
                                            >
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-neutral-800">
                <Container>
                    <div className="py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <Typography variant="h5" className="text-white mb-2">
                                Subscribe to our newsletter
                            </Typography>
                            <Typography variant="body2" className="text-neutral-400">
                                Get the latest updates to your inbox.
                            </Typography>
                        </div>
                        <form className="flex w-full md:w-auto max-w-md gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </Container>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800">
                <Container>
                    <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <Typography variant="caption" className="text-neutral-500 text-center md:text-left">
                            © {currentYear} {siteConfig.name}. All rights reserved.
                        </Typography>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-neutral-800 rounded-lg"
                                    aria-label={social.name}
                                >
                                    {socialIcons[social.icon] || <span>{social.name}</span>}
                                </a>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    );
};
