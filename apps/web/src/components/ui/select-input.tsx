"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { tv, type VariantProps } from "tailwind-variants";
import { Icon } from "./icons";
import { ChevronDown } from "lucide-react";

const selectVariants = tv({
    base: [
        "transition-all duration-200 rounded-lg text-foreground",
        "relative cursor-pointer",
        "focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed", "min-w-[120px]"
        ,
    ],
    variants: {
        variant: {
            default: "bg-white border border-gray-300 focus:ring-1 focus:ring-primary/20",
            filled: "bg-gray-100 border border-transparent focus:ring-1 focus:ring-primary/20",
            outlined: "bg-transparent border border-gray-300 focus:ring-1 focus:ring-primary/20",
        },
        size: {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4 text-sm",
            lg: "h-12 px-4 text-base",
        },
        state: {
            default: "",
            error: "border-error focus:ring-error/20",
            success: "border-success focus:ring-success/20",
            warning: "border-warning focus:ring-warning/20",
        },
        fullWidth: {
            true: "w-full",
            false: "",
        },
        open: {
            true: "border-primary ring-1 ring-primary/20",
            false: "",
        },
    },
    defaultVariants: {
        variant: "outlined",
        size: "md",
        state: "default",
        fullWidth: false,
        open: false,
    },
});

const helperTextVariants = tv({
    base: "mt-1 text-sm",
    variants: {
        state: {
            default: "text-gray-500",
            error: "text-error",
            success: "text-success",
            warning: "text-warning",
        },
    },
    defaultVariants: {
        state: "default",
    },
});

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps extends VariantProps<typeof selectVariants> {
    label?: string;
    helperText?: string;
    options?: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
    value?: string | number;
    onChange?: (value: string | number) => void;
}

export const Select: React.FC<SelectProps> = ({
    variant,
    size,
    state,
    fullWidth = false,
    label,
    helperText,
    options = [],
    placeholder = "Select an option",
    value,
    onChange,
}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | number>(value || "");
    const containerRef = useRef<HTMLDivElement>(null);
    const [openUp, setOpenUpward] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }

        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = Math.min(options.length * 40, 240); // each li ~40px
            setOpenUpward(spaceBelow < dropdownHeight);
        }
    }, [open, options.length]);

    const handleSelect = (val: string | number) => {
        setSelected(val);
        setOpen(false);
        onChange?.(val);
    };

    return (
        <div className={cn("relative", fullWidth && "w-full", "min-w-[200px]")} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-500 mb-1 cursor-pointer">
                    {label}
                </label>
            )}

            <div
                className={cn(
                    selectVariants({ variant, size, state, fullWidth, open }),
                    "flex items-center justify-between px-3 select-none"
                )}
                onClick={() => setOpen(!open)}
                ref={triggerRef}
            >
                <span className={selected ? "text-foreground" : "text-gray-400"}>
                    {selected ? options.find((opt) => opt.value === selected)?.label : placeholder}
                </span>
                <Icon
                    icon={ChevronDown}
                    size="md" className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
            </div>

            {open && (
                <ul
                    className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                    style={{ top: openUp ? "auto" : undefined, bottom: openUp ? "100%" : undefined }}
                >
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            className={cn(
                                "px-3 py-2 cursor-pointer hover:bg-primary/10",
                                selected === opt.value ? "bg-primary text-white" : "text-gray-700"
                            )}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}

            {helperText && (
                <p className={helperTextVariants({ state })}>{helperText}</p>
            )}
        </div>
    );
};
