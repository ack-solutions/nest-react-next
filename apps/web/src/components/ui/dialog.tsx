"use client";

import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@web/utils/cn";
import { tv, type VariantProps } from "tailwind-variants";
import { X } from "lucide-react";
import { Icon } from "./icons";

const dialogVariants = tv({
    slots: {
        overlay: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs",
        container: "w-full mx-4 sm:mx-0 bg-background rounded-xl shadow-xl overflow-hidden border border-border-subtle",
        header: "px-6 py-4 border-b border-border-subtle flex items-center justify-between",
        body: "px-6 py-6",
        footer: "px-6 py-4 border-t border-border-subtle flex items-center justify-end gap-3",
        title: "m-0 font-semibold text-text-primary",
        closeBtn: "text-gray-400 hover:text-primary cursor-pointer transition-colors p-1 rounded-lg hover:bg-gray-100",
    },
    variants: {
        size: {
            sm: { container: "max-w-sm" },
            md: { container: "max-w-md" },
            lg: { container: "max-w-lg" },
            xl: { container: "max-w-2xl" },
            full: { container: "max-w-[min(100vw,900px)] sm:max-w-[90vw]" },
        },
    },
    defaultVariants: {
        size: "lg",
    },
});

export interface DialogProps extends VariantProps<typeof dialogVariants> {
    open: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    containerClassName?: string;
}

export const Dialog: React.FC<DialogProps> = ({
    open,
    onClose,
    title,
    children,
    footer,
    size,
    className,
    containerClassName,
}) => {
    const slots = dialogVariants({ size });
    if (!open) return null;
    const content = (
        <div className={cn(slots.overlay(), className)} role="dialog" aria-modal="true">
            <div className={cn(slots.container(), containerClassName)}>
                {(title || typeof onClose === 'function') && (
                    <div className={slots.header()}>
                        {title && <h3 className={slots.title()}>{title}</h3>}
                        <button aria-label="Close" className={slots.closeBtn()} onClick={onClose}>
                            <Icon icon={X} size="md" />
                        </button>
                    </div>
                )}
                <div className={slots.body()}>{children}</div>
                {footer && <div className={slots.footer()}>{footer}</div>}
            </div>
        </div>
    );

    if (typeof window === 'undefined') return content;
    return createPortal(content, document.body);
};

export default Dialog;
