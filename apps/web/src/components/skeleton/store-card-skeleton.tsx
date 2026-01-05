import { Skeleton } from "./skeleton";
import { ButtonSkeleton } from "./button-skeleton";
import { RectangleSkeleton } from "./rectangle-skeleton";

export function StoreCardSkeleton() {
    return (
        <div className="shrink-0">
            {/* Wrapper to create space for overlapping circle */}
            <div className="pt-10 relative">
                {/* Circular Store Logo Skeleton - Positioned absolutely relative to wrapper */}
                <div className="absolute top-0 left-7 z-10">
                    <RectangleSkeleton 
                        width={80} 
                        height={80} 
                        className="rounded-xl border-3 border-white shadow-md" 
                    />
                </div>
                
                {/* Main Card Container */}
                <div className="relative rounded-2xl border border-gray-200 bg-background-elevated">

                    {/* Card Content */}
                    <div className="pt-12 pb-4 px-5">
                        {/* Store Name Skeleton */}
                        <Skeleton className="h-5 w-3/4 mb-2 rounded" />
                        
                        {/* Location Skeleton */}
                        <div className="flex items-center gap-1.5 mb-4">
                            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                            <Skeleton className="h-4 w-32 rounded" />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border-subtle mb-3 -mx-5"></div>

                        {/* Footer - Stats & CTA Skeleton */}
                        <div className="flex items-center justify-between">
                            {/* Deals Count Skeleton */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div>
                                    <Skeleton className="h-3 w-16 mb-1 rounded" />
                                    <Skeleton className="h-4 w-8 rounded" />
                                </div>
                            </div>
                            
                            {/* View Button Skeleton */}
                            <ButtonSkeleton size="sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

