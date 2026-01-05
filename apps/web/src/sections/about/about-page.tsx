'use client';

import React from 'react';
import { Target, Heart, Lightbulb, Users, Award, Rocket, ArrowRight } from 'lucide-react';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Card } from '@web/components/ui/card';
import { cn } from '@web/utils/cn';
import { authNavigation } from '@web/config';

// Company values
const values = [
    {
        icon: Heart,
        title: 'Customer First',
        description: 'We put our customers at the center of everything we do. Your success is our success.',
        color: 'text-error',
        bgColor: 'bg-error/10',
    },
    {
        icon: Lightbulb,
        title: 'Innovation',
        description: 'We constantly push boundaries and embrace new ideas to deliver cutting-edge solutions.',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
    },
    {
        icon: Users,
        title: 'Collaboration',
        description: 'We believe in the power of teamwork and building strong partnerships.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'We strive for excellence in everything we create, never settling for mediocrity.',
        color: 'text-success',
        bgColor: 'bg-success/10',
    },
];

// Team members
const team = [
    {
        name: 'John Smith',
        role: 'CEO & Founder',
        avatar: 'JS',
        bio: 'Visionary leader with 15+ years in tech.',
    },
    {
        name: 'Sarah Johnson',
        role: 'CTO',
        avatar: 'SJ',
        bio: 'Engineering expert driving innovation.',
    },
    {
        name: 'Michael Chen',
        role: 'Head of Design',
        avatar: 'MC',
        bio: 'Creating beautiful user experiences.',
    },
    {
        name: 'Emily Davis',
        role: 'Head of Marketing',
        avatar: 'ED',
        bio: 'Building brand awareness globally.',
    },
];

// Milestones
const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a vision to transform businesses.' },
    { year: '2021', title: 'First 1,000 Users', description: 'Reached our first major user milestone.' },
    { year: '2022', title: 'Series A Funding', description: 'Raised $10M to accelerate growth.' },
    { year: '2023', title: 'Global Expansion', description: 'Launched in 50+ countries worldwide.' },
    { year: '2024', title: '10K+ Customers', description: 'Serving over 10,000 businesses.' },
];

export function AboutPageClient() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl" />
                </div>

                <Container>
                    <div className="relative pt-16 pb-20 md:pt-24 md:pb-28 text-center">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            About Us
                        </Typography>
                        <Typography variant="h1" className="max-w-4xl mx-auto mb-6">
                            We're on a mission to{' '}
                            <span className="gradient-text">empower</span>
                            {' '}businesses everywhere
                        </Typography>
                        <Typography variant="body1" color="text-secondary" className="max-w-2xl mx-auto text-lg">
                            Founded with a passion for innovation, we're building the tools that help
                            businesses of all sizes achieve their full potential.
                        </Typography>
                    </div>
                </Container>
            </section>

            {/* Mission & Vision */}
            <section className="section-py">
                <Container>
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        <Card variant="elevated" padding="xl" className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full blur-2xl opacity-50" />
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                    <Target className="w-7 h-7 text-primary" />
                                </div>
                                <Typography variant="h3" className="mb-4">
                                    Our Mission
                                </Typography>
                                <Typography variant="body1" color="text-secondary" className="leading-relaxed">
                                    To democratize access to powerful business tools, enabling entrepreneurs
                                    and companies of all sizes to compete and thrive in the digital economy.
                                    We believe that great technology should be accessible to everyone.
                                </Typography>
                            </div>
                        </Card>

                        <Card variant="elevated" padding="xl" className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full blur-2xl opacity-50" />
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                                    <Rocket className="w-7 h-7 text-secondary" />
                                </div>
                                <Typography variant="h3" className="mb-4">
                                    Our Vision
                                </Typography>
                                <Typography variant="body1" color="text-secondary" className="leading-relaxed">
                                    To become the world's most trusted platform for business growth, known
                                    for our innovation, reliability, and unwavering commitment to customer
                                    success. We envision a world where every business can reach its full potential.
                                </Typography>
                            </div>
                        </Card>
                    </div>
                </Container>
            </section>

            {/* Values Section */}
            <section className="section-py bg-neutral-50">
                <Container>
                    <div className="text-center mb-16">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            Our Values
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            What drives us every day
                        </Typography>
                        <Typography variant="body1" color="text-secondary" className="max-w-2xl mx-auto">
                            These core values guide our decisions and shape our culture.
                        </Typography>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <Card key={index} variant="default" padding="lg" hover className="group text-center">
                                <div className={cn(
                                    'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110',
                                    value.bgColor
                                )}>
                                    <value.icon className={cn('w-7 h-7', value.color)} />
                                </div>
                                <Typography variant="h5" className="mb-3">
                                    {value.title}
                                </Typography>
                                <Typography variant="body2" color="text-secondary">
                                    {value.description}
                                </Typography>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Timeline Section */}
            <section className="section-py">
                <Container>
                    <div className="text-center mb-16">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            Our Journey
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Key milestones
                        </Typography>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-200 -translate-x-1/2" />

                        <div className="space-y-8 md:space-y-0">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={cn(
                                    'relative md:grid md:grid-cols-2 md:gap-8 md:py-8',
                                    index % 2 === 0 ? '' : ''
                                )}>
                                    {/* Content */}
                                    <div className={cn(
                                        'md:text-right',
                                        index % 2 !== 0 ? 'md:order-2 md:text-left' : ''
                                    )}>
                                        <Card variant="default" padding="lg" className={cn(
                                            'inline-block w-full md:max-w-sm',
                                            index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                                        )}>
                                            <Typography variant="overline" className="text-primary block mb-2">
                                                {milestone.year}
                                            </Typography>
                                            <Typography variant="h5" className="mb-2">
                                                {milestone.title}
                                            </Typography>
                                            <Typography variant="body2" color="text-secondary">
                                                {milestone.description}
                                            </Typography>
                                        </Card>
                                    </div>

                                    {/* Timeline dot */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md" />

                                    {/* Empty column for spacing */}
                                    <div className={cn(
                                        'hidden md:block',
                                        index % 2 !== 0 ? 'md:order-1' : ''
                                    )} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Team Section */}
            <section className="section-py bg-neutral-50">
                <Container>
                    <div className="text-center mb-16">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            Our Team
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Meet the people behind the product
                        </Typography>
                        <Typography variant="body1" color="text-secondary" className="max-w-2xl mx-auto">
                            A diverse team of passionate individuals working together to build something great.
                        </Typography>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <Card key={index} variant="default" padding="lg" className="text-center group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold transition-transform group-hover:scale-105">
                                    {member.avatar}
                                </div>
                                <Typography variant="h5" className="mb-1">
                                    {member.name}
                                </Typography>
                                <Typography variant="body2" className="text-primary mb-3">
                                    {member.role}
                                </Typography>
                                <Typography variant="caption" color="text-secondary">
                                    {member.bio}
                                </Typography>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="section-py">
                <Container>
                    <Card
                        variant="elevated"
                        padding="xl"
                        className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white text-center"
                    >
                        <Typography variant="h2" className="text-white mb-4">
                            Ready to join us?
                        </Typography>
                        <Typography variant="body1" className="text-white/80 max-w-xl mx-auto mb-8">
                            We're always looking for talented individuals who share our passion
                            for innovation and excellence.
                        </Typography>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                variant="contained"
                                size="lg"
                                className="bg-white text-primary hover:bg-white/90 border-none"
                                href="/careers"
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                View Open Positions
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/30 text-white hover:bg-white/10"
                                href="/contact"
                            >
                                Get in Touch
                            </Button>
                        </div>
                    </Card>
                </Container>
            </section>
        </>
    );
}
