import { Skeleton } from "./skeleton";
import { cn } from "@web/utils/cn";

interface RectangleSkeletonProps extends React.ComponentProps<"div"> {
    width?: string | number;
    height?: string | number;
}

export function RectangleSkeleton({ 
    width, 
    height, 
    className, 
    ...props 
}: RectangleSkeletonProps) {
    const style: React.CSSProperties = {};
    
    if (width) {
        style.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height) {
        style.height = typeof height === "number" ? `${height}px` : height;
    }

    return (
        <Skeleton
            className={cn(className)}
            style={Object.keys(style).length > 0 ? style : undefined}
            {...props}
        />
    );
}

