"use client";

import { Card } from "@web/components/ui/card";
import { Typography } from "@web/components/ui/typography";
import { cn } from "@web/utils/cn";
import React, { useState } from "react";
import {
    Lock,
    Calendar,
    LogOut,
    User,
    Wallet,
    ShoppingBag,
    Gift,
    Heart,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Sticky from 'react-stickynode';
import { toDisplayDate } from "@libs/utils";
import { Icon } from "@web/components/ui/icons";
import { Button } from "@web/components/ui/button";
import { useAuth } from "@libs/react-shared";

export type AccountTabKey =
    | "profile"
    | "orders"
    | "wallet"
    | "wishlist"
    | "refer-earn"
    | "change-password"

export interface AccountSidebarItem {
    key: AccountTabKey;
    label: string;
    icon: React.ReactNode;
}

export interface AccountSidebarProps {
    className?: string;
    name?: string;
    email?: string;
    avatarUrl?: string | null;
    items?: AccountSidebarItem[];
    selectedKey?: AccountTabKey; // controlled
    defaultSelectedKey?: AccountTabKey; // uncontrolled
    onChange?: (key: AccountTabKey) => void;
}

export const sidebarItems: AccountSidebarItem[] = [
    {
        key: "profile", label: "Personal Information", icon: <Icon icon={User} size="md" />,
    },
    { key: "orders", label: "My Orders", icon: <Icon icon={ShoppingBag} size="md" /> },
    { key: "wishlist", label: "My Wishlist", icon: <Icon icon={Heart} size="md" /> },
    { key: "wallet", label: "My Wallet", icon: <Icon icon={Wallet} size="md" /> },
    { key: "refer-earn", label: "Refer & Earn", icon: <Icon icon={Gift} size="md" /> },
    { key: "change-password", label: "Change Password", icon: <Icon icon={Lock} size="md" /> },
];

export default function AccountSidebar({
    selectedKey,
    defaultSelectedKey = "profile",
    onChange,
}: AccountSidebarProps) {
    const { currentUser, authUser } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [internalKey, setInternalKey] = React.useState<AccountTabKey>(defaultSelectedKey);

    // Derive active key from pathname if possible
    React.useEffect(() => {
        const match = pathname?.split("/").filter(Boolean) ?? [];
        // expecting /account/<slug>
        const last = match[match.length - 1];
        const maybeKey = (last as AccountTabKey) || undefined;
        if (maybeKey && sidebarItems.some((i) => i.key === maybeKey)) {
            if (selectedKey === undefined) setInternalKey(maybeKey);
        }
    }, [pathname, selectedKey]);

    const currentKey = selectedKey ?? internalKey;

    const onSelect = (key: AccountTabKey) => {
        if (selectedKey === undefined) setInternalKey(key);
        onChange?.(key);
        // Navigate to slug: /account/<key>
        router.push(`/account/${key}`);
    };

    return (
        <div className="lg:w-72 shrink-0">
            <Sticky top={150} bottomBoundary="#content">
                <Card className="p-6 sticky top-24">
                    {/* User Info */}
                    <div className="text-center mb-6 pb-6 border-b border-divider">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-3">
                            <Typography variant="h3" component="span" className="text-white">
                                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Typography>
                        </div>
                        <Typography variant="h5" component="p" className="mb-1">
                            {currentUser?.name}
                        </Typography>
                        <Typography variant="body2" color="text-secondary">
                            {authUser?.email}
                        </Typography>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <Icon icon={Calendar} size="xs" color="grey" />
                            <Typography variant="caption" color="text-secondary">
                                Member since {toDisplayDate(currentUser?.createdAt)}
                            </Typography>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.key}
                                onClick={() => onSelect(item.key)}
                                variant="text"
                                fullWidth
                                className={cn(
                                    "justify-start px-4 py-3 rounded-xl",
                                    currentKey === item.key
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'hover:bg-gray-50 text-text-primary'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={currentKey === item.key ? 'text-white' : 'text-text-secondary'}>
                                        {item.icon}
                                    </span>
                                    <Typography
                                        variant="body2"
                                        className={currentKey === item.key ? 'text-white' : 'text-text-primary'}
                                    >
                                        {item.label}
                                    </Typography>
                                </div>
                            </Button>
                        ))}
                    </nav>
                </Card>
            </Sticky>
        </div>
    );
}
