import { Skeleton } from "./skeleton";
import { CircleSkeleton } from "./circle-skeleton";
import { RectangleSkeleton } from "./rectangle-skeleton";
import { ButtonSkeleton } from "./button-skeleton";

export function DealCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <Skeleton className="w-full h-full rounded-none" />
                
                {/* Like Button Skeleton */}
                <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 bg-gray-300/80 backdrop-blur-sm rounded-full animate-pulse" />
                </div>

                {/* Discount Badge Skeleton */}
                <div className="absolute top-4 left-4">
                    <Skeleton className="h-7 w-20 rounded-full" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                
                {/* Vendor Name */}
                <Skeleton className="h-4 w-1/2 mb-2 rounded" />

                {/* Location */}
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-32 rounded" />
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-8 w-24 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-8 rounded" />
                        <Skeleton className="h-3 w-12 rounded" />
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-24 rounded" />
                    </div>
                </div>

                {/* CTA Button */}
                <div className="mt-4">
                    <ButtonSkeleton size="md" fullWidth />
                </div>
            </div>
        </div>
    );
}
