import { Container } from '@web/components/ui/container';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <div className="h-16 md:h-20 border-b border-grey-200 bg-white/80 backdrop-blur-sm">
                <Container>
                    <div className="flex items-center justify-between h-full">
                        <div className="w-32 h-8 bg-grey-200 rounded-lg animate-pulse" />
                        <div className="hidden md:flex items-center gap-4">
                            <div className="w-20 h-6 bg-grey-200 rounded animate-pulse" />
                            <div className="w-20 h-6 bg-grey-200 rounded animate-pulse" />
                            <div className="w-20 h-6 bg-grey-200 rounded animate-pulse" />
                        </div>
                        <div className="w-10 h-10 bg-grey-200 rounded-full animate-pulse" />
                    </div>
                </Container>
            </div>

            {/* Hero Skeleton */}
            <div className="py-16 md:py-24">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="w-24 h-6 bg-grey-200 rounded-full mx-auto animate-pulse" />
                        <div className="space-y-3">
                            <div className="w-full h-12 bg-grey-200 rounded-lg animate-pulse" />
                            <div className="w-3/4 h-12 bg-grey-200 rounded-lg mx-auto animate-pulse" />
                        </div>
                        <div className="w-2/3 h-6 bg-grey-200 rounded mx-auto animate-pulse" />
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <div className="w-36 h-12 bg-grey-200 rounded-xl animate-pulse" />
                            <div className="w-36 h-12 bg-grey-100 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Content Skeleton */}
            <div className="py-12">
                <Container>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-grey-200 p-6 space-y-4"
                            >
                                <div className="w-12 h-12 bg-grey-200 rounded-xl animate-pulse" />
                                <div className="w-3/4 h-6 bg-grey-200 rounded animate-pulse" />
                                <div className="space-y-2">
                                    <div className="w-full h-4 bg-grey-100 rounded animate-pulse" />
                                    <div className="w-5/6 h-4 bg-grey-100 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Loading Indicator */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg border border-grey-200">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-text-secondary">Loading...</span>
                </div>
            </div>
        </div>
    );
}
