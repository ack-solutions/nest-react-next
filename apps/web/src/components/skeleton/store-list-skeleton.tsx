import { Card } from '../ui/card';
import { Skeleton } from './skeleton';

interface StoreListSkeletonProps {
    /** Number of skeleton items to show */
    count?: number;
    /** Title for the section */
    title?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Skeleton component for the StoreList, matching its layout.
 */
export function StoreListSkeleton({
    count = 3,
    title = 'Available Stores',
    className,
}: StoreListSkeletonProps) {
    return (
        <Card variant="default" padding="lg" className={className}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
            </div>

            {/* Store Items */}
            <div className="space-y-1">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 py-4 ${
                            index !== count - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        {/* Store Logo */}
                        <Skeleton className="w-14 h-14 rounded-xl shrink-0" />

                        {/* Store Info */}
                        <div className="flex-1 min-w-0">
                            <Skeleton className="h-5 w-3/4 mb-2 rounded" />
                            <div className="flex items-start gap-1">
                                <Skeleton className="w-4 h-4 rounded-full shrink-0 mt-0.5" />
                                <Skeleton className="h-4 w-full max-w-[200px] rounded" />
                            </div>
                        </div>

                        {/* Arrow */}
                        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    </div>
                ))}
            </div>
        </Card>
    );
}
