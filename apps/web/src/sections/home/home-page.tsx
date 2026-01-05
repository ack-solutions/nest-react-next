'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, Globe, Users, Star, ChevronRight } from 'lucide-react';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Card } from '@web/components/ui/card';
import { cn } from '@web/utils/cn';
import { authNavigation } from '@web/config';

// Feature data
const features = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Optimized performance that keeps your business running at peak efficiency.',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
    },
    {
        icon: Shield,
        title: 'Secure by Design',
        description: 'Enterprise-grade security with end-to-end encryption and compliance.',
        color: 'text-success',
        bgColor: 'bg-success/10',
    },
    {
        icon: Globe,
        title: 'Global Scale',
        description: 'Built to grow with you, from startup to enterprise scale.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Seamless collaboration tools that bring your team together.',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
    },
];

// Stats data
const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Countries' },
    { value: '24/7', label: 'Support' },
];

// Testimonials
const testimonials = [
    {
        quote: "This platform has transformed how we operate. The efficiency gains have been incredible.",
        author: 'Sarah Johnson',
        role: 'CEO, TechStart Inc.',
        avatar: 'S',
    },
    {
        quote: "Best decision we made this year. The team collaboration features are game-changing.",
        author: 'Michael Chen',
        role: 'CTO, InnovateCo',
        avatar: 'M',
    },
    {
        quote: "Outstanding support and a product that just works. Highly recommended!",
        author: 'Emily Rodriguez',
        role: 'Founder, GrowthLab',
        avatar: 'E',
    },
];

export function HomePageClient() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-white">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl" />
                </div>

                <Container>
                    <div className="relative pt-20 pb-24 md:pt-32 md:pb-36 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium">
                            <Star className="w-4 h-4 fill-current" />
                            <span>Trusted by 10,000+ companies worldwide</span>
                        </div>

                        {/* Headline */}
                        <Typography
                            variant="h1"
                            className="max-w-4xl mx-auto mb-6"
                        >
                            Build something{' '}
                            <span className="gradient-text">amazing</span>
                            {' '}with our platform
                        </Typography>

                        {/* Subheadline */}
                        <Typography
                            variant="body1"
                            color="text-secondary"
                            className="max-w-2xl mx-auto mb-10 text-lg"
                        >
                            The all-in-one solution for modern businesses. Streamline your workflow,
                            boost productivity, and scale with confidence.
                        </Typography>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="contained"
                                size="xl"
                                href={authNavigation.register}
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                color="grey"
                                href="/demo"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-text-secondary">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-success" />
                                <span className="text-sm">No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-success" />
                                <span className="text-sm">14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-success" />
                                <span className="text-sm">Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16 bg-neutral-900 text-white">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <Typography variant="h2" className="text-white mb-2">
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" className="text-neutral-400">
                                    {stat.label}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Features Section */}
            <section className="section-py">
                <Container>
                    <div className="text-center mb-16">
                        <Typography
                            variant="overline"
                            className="text-primary mb-4 block"
                        >
                            Features
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Everything you need to succeed
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text-secondary"
                            className="max-w-2xl mx-auto"
                        >
                            Powerful features designed to help you work smarter, not harder.
                        </Typography>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                variant="default"
                                padding="lg"
                                hover
                                className="group"
                            >
                                <div className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110',
                                    feature.bgColor
                                )}>
                                    <feature.icon className={cn('w-6 h-6', feature.color)} />
                                </div>
                                <Typography variant="h5" className="mb-3">
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text-secondary">
                                    {feature.description}
                                </Typography>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* How It Works Section */}
            <section className="section-py bg-neutral-50">
                <Container>
                    <div className="text-center mb-16">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            How It Works
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Get started in 3 simple steps
                        </Typography>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                step: '01',
                                title: 'Create Account',
                                description: 'Sign up for free in seconds. No credit card required.',
                            },
                            {
                                step: '02',
                                title: 'Set Up Your Space',
                                description: 'Customize your workspace to match your workflow.',
                            },
                            {
                                step: '03',
                                title: 'Start Growing',
                                description: 'Launch and scale your business with confidence.',
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-bold text-xl mb-6">
                                    {item.step}
                                </div>
                                <Typography variant="h5" className="mb-3">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text-secondary">
                                    {item.description}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Testimonials Section */}
            <section className="section-py">
                <Container>
                    <div className="text-center mb-16">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            Testimonials
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Loved by teams worldwide
                        </Typography>
                        <Typography variant="body1" color="text-secondary" className="max-w-2xl mx-auto">
                            See what our customers have to say about their experience.
                        </Typography>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} variant="default" padding="lg">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                                    ))}
                                </div>
                                <Typography variant="body1" className="mb-6 italic">
                                    "{testimonial.quote}"
                                </Typography>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <Typography variant="body2" className="font-medium">
                                            {testimonial.author}
                                        </Typography>
                                        <Typography variant="caption" color="text-secondary">
                                            {testimonial.role}
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="section-py bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <Container>
                    <div className="relative text-center max-w-3xl mx-auto">
                        <Typography variant="h2" className="text-white mb-6">
                            Ready to get started?
                        </Typography>
                        <Typography variant="body1" className="text-white/80 mb-10 text-lg">
                            Join thousands of satisfied customers who have already transformed
                            their business with our platform.
                        </Typography>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="contained"
                                size="xl"
                                className="bg-white text-primary hover:bg-white/90 border-none"
                                href={authNavigation.register}
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                className="border-white/30 text-white hover:bg-white/10"
                                href="/contact"
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}
