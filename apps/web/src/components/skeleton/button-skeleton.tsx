import { Skeleton } from "./skeleton";
import { cn } from "@web/utils/cn";

interface ButtonSkeletonProps extends React.ComponentProps<"div"> {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    fullWidth?: boolean;
}

const sizeMap = {
    xs: "h-6 px-2.5",
    sm: "h-8 px-3",
    md: "h-10 px-4",
    lg: "h-12 px-6",
    xl: "h-14 px-8",
};

export function ButtonSkeleton({ 
    size = "md", 
    fullWidth = false,
    className, 
    ...props 
}: ButtonSkeletonProps) {
    return (
        <Skeleton
            className={cn(
                "rounded-lg",
                sizeMap[size],
                fullWidth && "w-full",
                className
            )}
            {...props}
        />
    );
}

