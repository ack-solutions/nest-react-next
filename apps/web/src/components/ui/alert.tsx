import * as React from "react";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    severity?: "success" | "info" | "warning" | "error";
    variant?: "standard" | "filled" | "outlined" | "soft";
    title?: string;
    children: React.ReactNode;

    closable?: boolean;
    onClose?: () => void;

    icon?: React.ReactNode;
    showIcon?: boolean;

    action?: React.ReactNode;

    closeText?: string;

    /** alias override */
    color?: "success" | "info" | "warning" | "error";

    iconMapping?: {
        success?: React.ReactNode;
        info?: React.ReactNode;
        warning?: React.ReactNode;
        error?: React.ReactNode;
    };

    components?: {
        CloseButton?: React.ComponentType<
            React.ButtonHTMLAttributes<HTMLButtonElement>
        >;
        CloseIcon?: React.ComponentType<{ className?: string }>;
    };

    role?: string;
}

type Severity = NonNullable<AlertProps["severity"]>;
type Variant = NonNullable<AlertProps["variant"]>;

const base =
    "relative w-full rounded-lg px-4 py-4 flex gap-3 items-start font-sans";

const contentBase = "min-w-0 flex-1 flex flex-col gap-1";
const titleBase = "text-sm leading-6 font-semibold";
const messageBase = "text-sm leading-6";
const actionBase = "mt-2";

const closeBtnBase =
    "shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-md transition-opacity opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const iconWrapBase = "shrink-0 mt-0.5";

const styles: Record<
    Variant,
    Record<
        Severity,
        { root: string; icon: string; title: string; message: string; close: string }
    >
> = {
    standard: {
        success: {
            root: "bg-emerald-50 text-slate-900",
            icon: "text-emerald-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-emerald-700 focus-visible:ring-emerald-500 focus-visible:ring-offset-emerald-50",
        },
        info: {
            root: "bg-sky-50 text-slate-900",
            icon: "text-sky-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-sky-700 focus-visible:ring-sky-500 focus-visible:ring-offset-sky-50",
        },
        warning: {
            root: "bg-amber-50 text-slate-900",
            icon: "text-amber-600",
            title: "text-slate-900",
            message: "text-slate-700",
            close: "text-amber-800 focus-visible:ring-amber-500 focus-visible:ring-offset-amber-50",
        },
        error: {
            root: "bg-rose-50 text-slate-900",
            icon: "text-rose-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-rose-700 focus-visible:ring-rose-500 focus-visible:ring-offset-rose-50",
        },
    },

    soft: {
        success: {
            root: "bg-emerald-50/80 text-slate-900 ring-1 ring-emerald-200",
            icon: "text-emerald-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-emerald-700 focus-visible:ring-emerald-500 focus-visible:ring-offset-emerald-50",
        },
        info: {
            root: "bg-sky-50/80 text-slate-900 ring-1 ring-sky-200",
            icon: "text-sky-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-sky-700 focus-visible:ring-sky-500 focus-visible:ring-offset-sky-50",
        },
        warning: {
            root: "bg-amber-50/80 text-slate-900 ring-1 ring-amber-200",
            icon: "text-amber-600",
            title: "text-slate-900",
            message: "text-slate-700",
            close: "text-amber-800 focus-visible:ring-amber-500 focus-visible:ring-offset-amber-50",
        },
        error: {
            root: "bg-rose-50/80 text-slate-900 ring-1 ring-rose-200",
            icon: "text-rose-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-rose-700 focus-visible:ring-rose-500 focus-visible:ring-offset-rose-50",
        },
    },

    outlined: {
        success: {
            root: "bg-white text-slate-900 ring-1 ring-emerald-300",
            icon: "text-emerald-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-emerald-700 focus-visible:ring-emerald-500 focus-visible:ring-offset-white",
        },
        info: {
            root: "bg-white text-slate-900 ring-1 ring-sky-300",
            icon: "text-sky-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-sky-700 focus-visible:ring-sky-500 focus-visible:ring-offset-white",
        },
        warning: {
            root: "bg-white text-slate-900 ring-1 ring-amber-300",
            icon: "text-amber-600",
            title: "text-slate-900",
            message: "text-slate-700",
            close: "text-amber-800 focus-visible:ring-amber-500 focus-visible:ring-offset-white",
        },
        error: {
            root: "bg-white text-slate-900 ring-1 ring-rose-300",
            icon: "text-rose-600",
            title: "text-slate-900",
            message: "text-slate-600",
            close: "text-rose-700 focus-visible:ring-rose-500 focus-visible:ring-offset-white",
        },
    },

    filled: {
        success: {
            root: "bg-emerald-600 text-white",
            icon: "text-white/95",
            title: "text-white",
            message: "text-white/90",
            close: "text-white/90 focus-visible:ring-white/70 focus-visible:ring-offset-emerald-600",
        },
        info: {
            root: "bg-sky-600 text-white",
            icon: "text-white/95",
            title: "text-white",
            message: "text-white/90",
            close: "text-white/90 focus-visible:ring-white/70 focus-visible:ring-offset-sky-600",
        },
        warning: {
            root: "bg-amber-500 text-slate-900",
            icon: "text-slate-900/95",
            title: "text-slate-900",
            message: "text-slate-900/90",
            close: "text-slate-900/90 focus-visible:ring-slate-900/40 focus-visible:ring-offset-amber-500",
        },
        error: {
            root: "bg-rose-600 text-white",
            icon: "text-white/95",
            title: "text-white",
            message: "text-white/90",
            close: "text-white/90 focus-visible:ring-white/70 focus-visible:ring-offset-rose-600",
        },
    },
};

function DefaultCloseIcon({ className }: { className?: string }) {
    return <X className={twMerge("h-4 w-4", className)} />;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    (
        {
            severity = "info",
            variant = "standard",
            title,
            children,
            closable = false,
            onClose,
            icon,
            showIcon = true,
            className,
            action,
            closeText = "Close",
            color,
            iconMapping,
            components,
            role = "alert",
            ...rest
        },
        ref
    ) => {
        const [isVisible, setIsVisible] = React.useState(true);
        if (!isVisible) return null;

        const s = (color || severity) as Severity;
        const v = variant as Variant;
        const cls = styles[v][s];

        const getIcon = () => {
            if (icon) return icon;

            const iconProps = { className: "h-5 w-5", strokeWidth: 2 };
            const mapping = iconMapping || {};

            switch (s) {
                case "success":
                    return mapping.success || <CheckCircle {...iconProps} />;
                case "info":
                    return mapping.info || <Info {...iconProps} />;
                case "warning":
                    return mapping.warning || <AlertCircle {...iconProps} />;
                case "error":
                    return mapping.error || <XCircle {...iconProps} />;
                default:
                    return <Info {...iconProps} />;
            }
        };

        const CloseButton = components?.CloseButton;
        const CloseIcon = components?.CloseIcon || DefaultCloseIcon;

        const handleClose = () => {
            setIsVisible(false);
            onClose?.();
        };

        return (
            <div
                ref={ref}
                role={role}
                className={twMerge(base, cls.root, className)}
                {...rest}
            >
                {showIcon && (
                    <div className={twMerge(iconWrapBase, cls.icon)}>{getIcon()}</div>
                )}

                <div className={contentBase}>
                    {title ? <div className={twMerge(titleBase, cls.title)}>{title}</div> : null}

                    <div className={twMerge(messageBase, cls.message)}>{children}</div>

                    {action ? <div className={actionBase}>{action}</div> : null}
                </div>

                {closable ? (
                    CloseButton ? (
                        <CloseButton aria-label={closeText} onClick={handleClose} />
                    ) : (
                        <button
                            type="button"
                            aria-label={closeText}
                            onClick={handleClose}
                            className={twMerge(closeBtnBase, cls.close)}
                        >
                            <CloseIcon />
                        </button>
                    )
                ) : null}
            </div>
        );
    }
);

Alert.displayName = "Alert";
export default Alert;