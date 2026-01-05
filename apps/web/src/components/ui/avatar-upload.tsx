"use client";

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@web/utils/cn";
import Image from "./image";
import { Typography } from "./typography";
import { Camera, X, Loader2 } from "lucide-react";

const avatarVariants = tv({
    slots: {
        root: "inline-flex flex-col gap-2",
        label: "",
        wrapper: "relative inline-flex items-center justify-center overflow-hidden",
        image: "object-cover",
        overlay: [
            "absolute inset-0 flex items-center justify-center",
            "bg-black/0 hover:bg-black/50 transition-colors",
            "opacity-0 hover:opacity-100",
            "text-white",
        ],
        uploadButton: [
            "absolute bottom-2 right-2",
            "rounded-full bg-background border border-divider shadow",
            "p-2 text-foreground hover:bg-grey/40 transition-colors",
        ],
        removeButton: [
            "absolute top-2 right-2",
            "rounded-full bg-background border border-divider shadow",
            "p-1 text-foreground hover:bg-grey/40 transition-colors",
        ],
        placeholder: [
            "flex items-center justify-center",
            "bg-grey text-foreground/70",
        ],
        helper: "",
        input: "sr-only",
        progress: [
            "absolute inset-0 flex items-center justify-center",
            "bg-black/40 text-white",
        ],
    },
    variants: {
        size: {
            sm: {
                wrapper: "w-16 h-16",
                image: "w-16 h-16",
                placeholder: "w-16 h-16",
            },
            md: {
                wrapper: "w-20 h-20",
                image: "w-20 h-20",
                placeholder: "w-20 h-20",
            },
            lg: {
                wrapper: "w-28 h-28",
                image: "w-28 h-28",
                placeholder: "w-28 h-28",
            },
            xl: {
                wrapper: "w-36 h-36",
                image: "w-36 h-36",
                placeholder: "w-36 h-36",
            },
        },
        shape: {
            circular: {
                wrapper: "rounded-full",
                image: "rounded-full",
                placeholder: "rounded-full",
            },
            rounded: {
                wrapper: "rounded-xl",
                image: "rounded-xl",
                placeholder: "rounded-xl",
            },
        },
        bordered: {
            true: {
                wrapper: "border border-divider",
            },
        },
        disabled: {
            true: {
                wrapper: "opacity-60 pointer-events-none",
            },
        },
        error: {
            true: {
                wrapper: "ring-2 ring-error",
            },
        },
    },
    defaultVariants: {
        size: "md",
        shape: "circular",
        bordered: true,
        disabled: false,
        error: false,
    },
});

export interface AvatarUploadProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof avatarVariants> {
    label?: string;
    helperText?: string;
    error?: boolean;
    disabled?: boolean;
    accept?: string;
    src?: string | null;
    value?: File | null; // controlled file
    onChange?: (file: File | null) => void;
    onRemove?: () => void;
    loading?: boolean;
    showRemove?: boolean;
    name?: string;
    id?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
    label,
    helperText,
    error = false,
    disabled = false,
    accept = "image/*",
    src,
    value,
    onChange,
    onRemove,
    loading = false,
    showRemove = true,
    name,
    id,
    size = "md",
    shape = "circular",
    bordered = true,
    className,
    ...props
}) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    // Internal preview URL to support uncontrolled usage (no value prop)
    const [internalPreviewUrl, setInternalPreviewUrl] = React.useState<string | null>(null);

    // If a controlled File value is provided, derive a preview URL from it
    React.useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setInternalPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        // If value is cleared by parent, clear internal preview as well
        if (value == null) {
            setInternalPreviewUrl(null);
        }
    }, [value]);

    const slots = avatarVariants({ size, shape, bordered, disabled, error });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        // Always set internal preview for immediate visual feedback
        if (file) {
            const url = URL.createObjectURL(file);
            // Revoke previous internal URL (if any) before replacing
            setInternalPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
            });
        } else {
            setInternalPreviewUrl(null);
        }

        if (onChange) onChange(file);
        // Reset input value so the same file can be re-selected
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleOpenFileDialog = () => {
        if (disabled || loading) return;
        inputRef.current?.click();
    };

    const finalSrc = internalPreviewUrl ?? (src || null);

    return (
        <div className={cn(slots.root(), className)} {...props}>
            {label && (
                <Typography variant="body2" className={slots.label()}>
                    {label}
                </Typography>
            )}

            <div className={slots.wrapper()} role="button" aria-disabled={disabled} onClick={handleOpenFileDialog}>
                {finalSrc ? (
                    <Image src={finalSrc} alt="Avatar" className={slots.image()} />
                ) : (
                    <div className={slots.placeholder()}>
                        <Camera className="w-6 h-6" aria-hidden />
                    </div>
                )}

                {/* Hover overlay */}
                {!disabled && !loading && (
                    <div className={slots.overlay()}>
                        <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
                            <Camera className="w-4 h-4" />
                            <Typography variant="caption">Change</Typography>
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className={slots.progress()}>
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                )}

                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type="file"
                    accept={accept}
                    className={slots.input()}
                    onChange={handleFileChange}
                    tabIndex={-1}
                    aria-hidden
                    disabled={disabled || loading}
                />
            </div>

            {helperText && (
                <Typography
                    variant="caption"
                    color={error ? "error" : "text-secondary"}
                    className={slots.helper()}
                >
                    {helperText}
                </Typography>
            )}
        </div>
    );
};

export default AvatarUpload;
