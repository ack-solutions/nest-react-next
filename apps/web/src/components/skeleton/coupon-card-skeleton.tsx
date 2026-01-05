import { Skeleton } from "./skeleton";
import { ButtonSkeleton } from "./button-skeleton";
import { Card } from "../ui/card";

export function CouponCardSkeleton() {
    return (
        <Card
            variant="default"
            padding="none"
            hover={false}
            className="overflow-hidden"
        >
            <div className="flex h-full max-h-50">
                {/* Left Side - Image Section */}
                <div className="relative max-w-50 w-full shrink-0 bg-gray-100">
                    <Skeleton className="w-full h-full rounded-none" />
                    
                    {/* FREE Badge Skeleton - Top Left */}
                    <div className="absolute top-2 left-2">
                        <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                </div>

                {/* Right Side - Content Section */}
                <div className="flex-1 p-3 flex flex-col">
                    {/* Title */}
                    <Skeleton className="h-5 w-3/4 mb-2 rounded" />
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 mb-2">
                        <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>

                    {/* Expiry Date */}
                    <div className="flex items-center gap-1 pb-2">
                        <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>

                    {/* Bottom Section - Button Skeleton */}
                    <div className="mt-auto">
                        <ButtonSkeleton size="md" fullWidth />
                    </div>
                </div>
            </div>
        </Card>
    );
}

