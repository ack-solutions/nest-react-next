"use client";

import { motion } from "framer-motion";
import { cn } from "@web/utils/cn";

type LoaderVariant =
    | "bouncing-balls"
    | "pulse-ring"
    | "wave-dots"
    | "elastic-bar"


type ColorVariant = "primary" | "secondary" | "success" | "error" | "warning" | "info";

interface LoaderProps {
    variant?: LoaderVariant;
    message?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    color?: ColorVariant;
}

const sizeClasses = {
    sm: { container: "gap-1", ball: "w-2 h-2", text: "text-xs" },
    md: { container: "gap-1.5", ball: "w-3 h-3", text: "text-sm" },
    lg: { container: "gap-2", ball: "w-4 h-4", text: "text-base" },
};

const colorClasses = {
    primary: "bg-primary border-primary",
    secondary: "bg-secondary border-secondary",
    success: "bg-[#34a853] border-[#34a853]",
    error: "bg-[#ea4335] border-[#ea4335]",
    warning: "bg-[#f1b642] border-[#f1b642]",
    info: "bg-[#0ea5e9] border-[#0ea5e9]",
};

const BouncingBalls = ({ size = "md", color = "primary" }: { size: LoaderProps["size"]; color: ColorVariant }) => {
    const ballSize = sizeClasses[size].ball;

    return (
        <div className={cn("flex items-center", sizeClasses[size].container)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                    }}
                    className={cn(ballSize, "rounded-full", colorClasses[color])}
                />
            ))}
        </div>
    );
};

export function PulseRing({
    size = "md",
    color = "primary",
}: {
    size?: "sm" | "md" | "lg";
    color?: keyof typeof colorClasses;
}) {
    const dimensions = size === "sm" ? 40 : size === "lg" ? 64 : 52;

    return (
        <div
            className="relative"
            style={{ width: dimensions, height: dimensions }}
        >
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "absolute inset-0 rounded-full border-4",
                        colorClasses[color]
                    )}
                    animate={{
                        scale: [0, 1.5],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear",
                        delay: i * 0.4,
                    }}
                    style={{
                        animationDelay: `${-i * 0.4}s`,
                    }}
                />
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={cn("w-3 h-3 rounded-full", colorClasses[color])}
                />
            </div>
        </div>
    );
}

const WaveDots = ({ size = "md", color = "primary" }: { size: LoaderProps["size"]; color: ColorVariant }) => {
    const ballSize = sizeClasses[size].ball;

    return (
        <div className={cn("flex items-center", sizeClasses[size].container)}>
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                    }}
                    className={cn(ballSize, "rounded-full", colorClasses[color])}
                />
            ))}
        </div>
    );
};

const ElasticBar = ({ size = "md", color = "primary" }: { size: LoaderProps["size"]; color: ColorVariant }) => {
    const width = size === "sm" ? 60 : size === "lg" ? 100 : 80;
    const height = size === "sm" ? 4 : size === "lg" ? 6 : 5;

    const bgColorMap = {
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        success: "bg-[#34a853]/20",
        error: "bg-[#ea4335]/20",
        warning: "bg-[#f1b642]/20",
        info: "bg-[#0ea5e9]/20",
    };

    return (
        <div
            className={cn("relative overflow-hidden rounded-full", bgColorMap[color])}
            style={{ width, height }}
        >
            <motion.div
                className={cn("absolute inset-y-0 left-0 rounded-full", colorClasses[color])}
                animate={{
                    x: ["-100%", "200%"],
                    scaleX: [1, 1.5, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ width: "50%" }}
            />
        </div>
    );
};

export function Loader({
    variant = "bouncing-balls",
    message,
    className,
    size = "md",
    color = "primary",
}: LoaderProps) {
    const variants = {
        "bouncing-balls": <BouncingBalls size={size} color={color} />,
        "pulse-ring": <PulseRing size={size} color={color} />,
        "wave-dots": <WaveDots size={size} color={color} />,
        "elastic-bar": <ElasticBar size={size} color={color} />,
    };

    return (
        <div
            className={cn(
                "flex min-h-screen w-full flex-col items-center justify-center gap-6",
                className
            )}
        >
            <div className="flex items-center justify-center">
                {variants[variant]}
            </div>

            {message && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={cn(
                        "font-medium text-muted-foreground",
                        sizeClasses[size].text
                    )}
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
}
