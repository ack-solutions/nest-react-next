'use client';

import React from 'react';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';
import { IPage } from '@libs/types';
import { cn } from '@web/utils/cn';
import styles from './page.module.css';

interface DynamicPageClientProps {
    page: IPage;
}

export function DynamicPageClient({ page }: DynamicPageClientProps) {
    return (
        <>
            {/* Page Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -left-40 w-80 h-80 bg-secondary-200/20 rounded-full blur-3xl" />
                </div>

                <Container>
                    <div className="relative pt-12 pb-10 md:pt-20 md:pb-12">
                        <Typography
                            variant="h1"
                            color="text-primary"
                            className="max-w-4xl"
                        >
                            {page.title}
                        </Typography>
                        {page.metaData?.meta?.find(m => m.key === 'description')?.value && (
                            <Typography
                                variant="body1"
                                color="text-secondary"
                                className="mt-4 max-w-3xl"
                            >
                                {page.metaData.meta.find(m => m.key === 'description')?.value}
                            </Typography>
                        )}
                    </div>
                </Container>
            </section>

            {/* Page Content */}
            <section className="section-py">
                <Container>
                    {page.content ? (
                        <div
                            className="cms-content max-w-4xl"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-neutral-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <Typography variant="h5" color="text-secondary" className="mb-2">
                                No content available
                            </Typography>
                            <Typography variant="body2" color="text-secondary">
                                This page doesn't have any content yet.
                            </Typography>
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
