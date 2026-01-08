'use client';

import React, { useState } from 'react';
import { object, string } from 'yup';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, Building } from 'lucide-react';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Card } from '@web/components/ui/card';
import { Stack } from '@web/components/ui/stack';
import {
    Form,
    FormInput,
    FormTextArea,
    FormRow,
    FormActions,
    FormError,
    FormSuccess,
    useAppForm,
} from '@web/components/ui/form';
import { cn } from '@web/utils/cn';

// Validation Schema
const contactSchema = object().shape({
    firstName: string().trim().required('First name is required'),
    lastName: string().trim().required('Last name is required'),
    email: string().trim().email('Please enter a valid email').required('Email is required'),
    phone: string().trim(),
    subject: string().trim().required('Subject is required'),
    message: string().trim().min(10, 'Message must be at least 10 characters').required('Message is required'),
});

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

// Contact methods
const contactMethods = [
    {
        icon: Mail,
        title: 'Email Us',
        description: 'Our team will respond within 24 hours.',
        value: 'support@yourcompany.com',
        href: 'mailto:support@yourcompany.com',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
    },
    {
        icon: Phone,
        title: 'Call Us',
        description: 'Mon-Fri from 8am to 6pm.',
        value: '+1 (234) 567-890',
        href: 'tel:+1234567890',
        color: 'text-success',
        bgColor: 'bg-success/10',
    },
    {
        icon: MessageSquare,
        title: 'Live Chat',
        description: 'Chat with our support team.',
        value: 'Start a conversation',
        href: '#chat',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
    },
];

// FAQ items
const faqs = [
    {
        question: 'How quickly do you respond to inquiries?',
        answer: 'We aim to respond to all inquiries within 24 hours during business days. For urgent matters, we recommend using our live chat or phone support.',
    },
    {
        question: 'Do you offer product demos?',
        answer: 'Yes! We offer personalized product demos. Simply fill out the contact form or schedule a call with our sales team.',
    },
    {
        question: 'What are your support hours?',
        answer: 'Our support team is available Monday through Friday, 8am to 6pm EST. Premium plans include 24/7 support.',
    },
];

export function ContactPageClient() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useAppForm<ContactFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
        schema: contactSchema,
    });

    const onSubmit = async (data: ContactFormData) => {
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        form.reset();

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl" />
                </div>

                <Container>
                    <div className="relative pt-16 pb-12 md:pt-24 md:pb-16 text-center">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            Contact Us
                        </Typography>
                        <Typography variant="h1" className="max-w-3xl mx-auto mb-6">
                            We'd love to hear from you
                        </Typography>
                        <Typography variant="body1" color="text-secondary" className="max-w-2xl mx-auto text-lg">
                            Have a question, feedback, or just want to say hello? Drop us a message
                            and we'll get back to you as soon as possible.
                        </Typography>
                    </div>
                </Container>
            </section>

            {/* Contact Methods */}
            <section className="py-12 -mt-8 relative z-10">
                <Container>
                    <div className="grid md:grid-cols-3 gap-6">
                        {contactMethods.map((method, index) => (
                            <Card key={index} variant="elevated" padding="lg" hover className="group text-center">
                                <div className={cn(
                                    'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110',
                                    method.bgColor
                                )}>
                                    <method.icon className={cn('w-7 h-7', method.color)} />
                                </div>
                                <Typography variant="h5" className="mb-2">
                                    {method.title}
                                </Typography>
                                <Typography variant="body2" color="text-secondary" className="mb-3">
                                    {method.description}
                                </Typography>
                                <a
                                    href={method.href}
                                    className={cn('font-medium hover:underline', method.color)}
                                >
                                    {method.value}
                                </a>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Contact Form & Info */}
            <section className="section-py">
                <Container>
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <Typography variant="h3" className="mb-2">
                                Send us a message
                            </Typography>
                            <Typography variant="body2" color="text-secondary" className="mb-8">
                                Fill out the form below and we'll get back to you shortly.
                            </Typography>

                            <FormSuccess message={isSubmitted ? 'Thank you for your message! We\'ll get back to you soon.' : null} />

                            <Form form={form} onSubmit={onSubmit}>
                                <FormError message={error} />

                                <FormRow columns={2}>
                                    <FormInput
                                        name="firstName"
                                        label="First Name"
                                        placeholder="John"
                                        fullWidth
                                        inputSize="lg"
                                        required
                                    />
                                    <FormInput
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Doe"
                                        fullWidth
                                        inputSize="lg"
                                        required
                                    />
                                </FormRow>

                                <FormRow columns={2}>
                                    <FormInput
                                        name="email"
                                        label="Email"
                                        type="email"
                                        placeholder="you@example.com"
                                        fullWidth
                                        inputSize="lg"
                                        required
                                    />
                                    <FormInput
                                        name="phone"
                                        label="Phone (Optional)"
                                        type="tel"
                                        placeholder="+1 (234) 567-890"
                                        fullWidth
                                        inputSize="lg"
                                    />
                                </FormRow>

                                <FormInput
                                    name="subject"
                                    label="Subject"
                                    placeholder="How can we help you?"
                                    fullWidth
                                    inputSize="lg"
                                    required
                                />

                                <FormTextArea
                                    name="message"
                                    label="Message"
                                    placeholder="Tell us more about your inquiry..."
                                    rows={5}
                                    fullWidth
                                    required
                                />

                                <FormActions align="left">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="lg"
                                        loading={form.formState.isSubmitting}
                                        disabled={form.formState.isSubmitting}
                                        leftIcon={<Send className="w-5 h-5" />}
                                    >
                                        {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </FormActions>
                            </Form>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2">
                            <Card variant="filled" padding="lg" className="mb-6">
                                <Typography variant="h5" className="mb-4">
                                    Office Location
                                </Typography>
                                <Stack spacing={4} direction="column">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Building className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <Typography variant="body2" className="font-medium">
                                                Headquarters
                                            </Typography>
                                            <Typography variant="body2" color="text-secondary">
                                                123 Business Street<br />
                                                Suite 456<br />
                                                City, State 12345
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-success" />
                                        </div>
                                        <div>
                                            <Typography variant="body2" className="font-medium">
                                                Business Hours
                                            </Typography>
                                            <Typography variant="body2" color="text-secondary">
                                                Monday - Friday: 8am - 6pm<br />
                                                Saturday: 9am - 1pm<br />
                                                Sunday: Closed
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                                            <Headphones className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <Typography variant="body2" className="font-medium">
                                                Support
                                            </Typography>
                                            <Typography variant="body2" color="text-secondary">
                                                Premium plans include<br />
                                                24/7 priority support
                                            </Typography>
                                        </div>
                                    </div>
                                </Stack>
                            </Card>

                            {/* Map placeholder */}
                            <Card variant="default" padding="none" className="overflow-hidden h-64">
                                <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                    <Stack spacing={2} direction="column" alignItems="center">
                                        <MapPin className="w-8 h-8 text-neutral-400" />
                                        <Typography variant="body2" color="text-secondary">
                                            Map coming soon
                                        </Typography>
                                    </Stack>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Container>
            </section>

            {/* FAQ Section */}
            <section className="section-py bg-neutral-50">
                <Container>
                    <div className="text-center mb-12">
                        <Typography variant="overline" className="text-primary mb-4 block">
                            FAQ
                        </Typography>
                        <Typography variant="h2" className="mb-4">
                            Common Questions
                        </Typography>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Stack spacing={4} direction="column">
                            {faqs.map((faq, index) => (
                                <Card key={index} variant="default" padding="lg">
                                    <Typography variant="h6" className="mb-2">
                                        {faq.question}
                                    </Typography>
                                    <Typography variant="body2" color="text-secondary">
                                        {faq.answer}
                                    </Typography>
                                </Card>
                            ))}
                        </Stack>
                    </div>
                </Container>
            </section>
        </>
    );
}
