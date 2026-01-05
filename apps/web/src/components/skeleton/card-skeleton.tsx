import { Skeleton } from "./skeleton";
import { cn } from "@web/utils/cn";

interface CardSkeletonProps extends React.ComponentProps<"div"> {
    showImage?: boolean;
    imageHeight?: string;
    showFooter?: boolean;
}

export function CardSkeleton({ 
    showImage = true,
    imageHeight = "h-48",
    showFooter = true,
    className, 
    ...props 
}: CardSkeletonProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col",
                className
            )}
            {...props}
        >
            {showImage && (
                <Skeleton className={cn("w-full", imageHeight)} />
            )}
            <div className="p-5 flex flex-col flex-1 gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                {showFooter && (
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                )}
            </div>
        </div>
    );
}

