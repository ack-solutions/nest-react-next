"use client";

import React from "react";
import { cn } from "@web/utils/cn";

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
    elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    square?: boolean;
    variant?: "elevation" | "outlined";
    sx?: React.CSSProperties;
    className?: string;
    children: React.ReactNode;
}

const elevationShadows = {
    0: "shadow-none",
    1: "shadow-sm",
    2: "shadow",
    3: "shadow-md",
    4: "shadow-lg",
    5: "shadow-xl",
    6: "shadow-2xl",
    7: "shadow-[0_8px_16px_rgba(0,0,0,0.2)]",
    8: "shadow-[0_10px_20px_rgba(0,0,0,0.25)]",
    9: "shadow-[0_12px_24px_rgba(0,0,0,0.3)]",
    10: "shadow-[0_16px_32px_rgba(0,0,0,0.35)]",
};

export const Paper: React.FC<PaperProps> = ({
    elevation = 1,
    square = false,
    variant = "elevation",
    sx,
    className,
    children,
    ...props
}) => {
    const baseClasses = cn(
        "bg-white",
        square ? "" : "rounded-xl",
        variant === "outlined" ? "border border-gray-300" : elevationShadows[elevation],
        className
    );

    return (
        <div className={baseClasses} style={sx} {...props}>
            {children}
        </div>
    );
};
