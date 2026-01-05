'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent } from '@web/components/ui/card';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import { Icon } from '@web/components/ui/icons';
import { cn } from '@web/utils/cn';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export interface ContactFormProps {
    onSubmit?: (data: ContactFormData) => Promise<void> | void;
    className?: string;
    title?: string;
    description?: string;
}

const SUBJECT_OPTIONS = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Customer Support' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'refund', label: 'Refund Request' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' },
];

const validationSchema = object().shape({
    name: string().trim().label('Name').required('Name is required'),
    email: string().trim().label('Email').required('Email is required').email('Please enter a valid email'),
    phone: string().trim().label('Phone'),
    subject: string().trim().label('Subject'),
    message: string().trim().label('Message'),
});

export function ContactForm({
    onSubmit,
    className,
    title = 'Send us a Message',
    description = "Fill out the form below and we'll get back to you as soon as possible.",
}: ContactFormProps) {
    const {
        register,
        handleSubmit: handleFormSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
        resolver: yupResolver(validationSchema) as any,
    });

    const onSubmitForm = async (data: ContactFormData) => {
        try {
            if (onSubmit) {
                await onSubmit(data);
            }
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Card className={cn(className)}>
            <CardContent className="p-8">
                <div className="mb-6">
                    <Typography variant="h2" gutterBottom>
                        {title}
                    </Typography>
                    {description && (
                        <Typography variant="body2" color="text-secondary">
                            {description}
                        </Typography>
                    )}
                </div>

                <form onSubmit={handleFormSubmit(onSubmitForm)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            type="text"
                            placeholder="Enter your name"
                            label="Full Name *"
                            fullWidth
                            {...register('name')}
                            helperText={errors.name?.message}
                            state={errors.name ? 'error' : 'default'}
                        />
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            label="Email Address *"
                            fullWidth
                            {...register('email')}
                            helperText={errors.email?.message}
                            state={errors.email ? 'error' : 'default'}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            type="tel"
                            placeholder="+91 1234567890"
                            label="Phone Number"
                            fullWidth
                            {...register('phone')}
                            helperText={errors.phone?.message}
                            state={errors.phone ? 'error' : 'default'}
                        />
                        <div>
                            <Typography variant="body2" component="label" sx={{ mb: 1, display: 'block' }} color="text-primary">
                                Subject *
                            </Typography>
                            <select
                                {...register('subject')}
                                className={cn(
                                    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent",
                                    errors.subject ? "border-red-300" : "border-gray-300"
                                )}
                            >
                                <option value="">Select a subject</option>
                                {SUBJECT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.subject && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                    {errors.subject.message}
                                </Typography>
                            )}
                        </div>
                    </div>

                    <div>
                        <Typography variant="body2" component="label" sx={{ mb: 1, display: 'block' }} color="text-primary">
                            Message *
                        </Typography>
                        <textarea
                            {...register('message')}
                            rows={6}
                            className={cn(
                                "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none",
                                errors.message ? "border-red-300" : "border-gray-300"
                            )}
                            placeholder="Tell us how we can help you..."
                        />
                        {errors.message && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {errors.message.message}
                            </Typography>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        leftIcon={<Icon icon={Send} />}
                    >
                        Send Message
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

