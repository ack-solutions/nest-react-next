import { Skeleton } from "./skeleton";
import { cn } from "@web/utils/cn";

interface CircleSkeletonProps extends React.ComponentProps<"div"> {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
}

const sizeMap = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
};

export function CircleSkeleton({ 
    size = "md", 
    className, 
    ...props 
}: CircleSkeletonProps) {
    const sizeClass = typeof size === "string" ? sizeMap[size] : "";
    const sizeStyle: React.CSSProperties | undefined = typeof size === "number" 
        ? { width: `${size}px`, height: `${size}px` }
        : undefined;

    return (
        <Skeleton
            className={cn(
                "rounded-full",
                sizeClass,
                className
            )}
            style={sizeStyle}
            {...props}
        />
    );
}

