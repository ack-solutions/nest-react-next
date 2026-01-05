import Link from 'next/link';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-grey-50 to-white flex items-center justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-lighter/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-lighter/50 rounded-full blur-3xl" />
            </div>

            <Container>
                <div className="relative text-center section-py">
                    {/* 404 Number */}
                    <div className="mb-8">
                        <span className="text-[10rem] md:text-[12rem] font-bold leading-none gradient-text opacity-20">
                            404
                        </span>
                    </div>

                    {/* Content */}
                    <div className="relative">

                        <Typography variant="h1" className="mb-4">
                            Page Not Found
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text-secondary"
                            className="max-w-md mx-auto mb-8 text-lg"
                        >
                            Sorry, we couldn't find the page you're looking for.
                            The page might have been moved, deleted, or never existed.
                        </Typography>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="contained"
                                size="lg"
                                href="/"
                                leftIcon={<Home className="w-5 h-5" />}
                            >
                                Back to Home
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                href="javascript:history.back()"
                                leftIcon={<ArrowLeft className="w-5 h-5" />}
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-16 pt-8 border-t border-grey-200">
                        <Typography variant="body2" color="text-secondary" className="mb-4">
                            Here are some helpful links:
                        </Typography>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Link
                                href="/"
                                className="text-primary hover:text-primary-dark font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="text-primary hover:text-primary-dark font-medium transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="text-primary hover:text-primary-dark font-medium transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
