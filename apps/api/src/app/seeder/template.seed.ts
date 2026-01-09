import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { Seeder } from '@ackplus/nest-seeder';
import { TemplateLayoutService as NestTemplateLayoutService } from '@ackplus/nest-dynamic-templates';
import { TemplateService as NestTemplateService } from '@ackplus/nest-dynamic-templates';
import { TemplateEngineEnum, TemplateLanguageEnum } from '@ackplus/nest-dynamic-templates';
import { NestDynamicTemplate } from '@ackplus/nest-dynamic-templates/dist/lib/entities/template.entity';
import { NestDynamicTemplateLayout } from '@ackplus/nest-dynamic-templates/dist/lib/entities/template-layout.entity';


interface TemplateDefinition {
    name: string;
    displayName: string;
    description: string;
    subject: string;
    previewContext: Record<string, any>;
}

@Injectable()
export class EmailTemplateSeeder implements Seeder {

    private readonly templates: TemplateDefinition[] = [
        {
            name: 'welcome-email',
            displayName: 'Welcome Email',
            description: 'Welcome email sent to new users after signup',
            subject: `Welcome to ${process.env.APP_NAME || 'Our App'}! 🎉`,
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                loginUrl: "https://example.com/login"
            }
        },
        {
            name: 'login-otp-verification',
            displayName: 'Login OTP Verification',
            description: 'OTP verification email for user login',
            subject: `Your Login Verification Code - ${process.env.APP_NAME || 'Our App'}`,
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                otp: "123456",
                expiryMinutes: "10",
                timestamp: "January 6, 2025 at 10:30 AM",
                ipAddress: "192.168.1.1"
            }
        },
        {
            name: 'signup-otp-verification',
            displayName: 'Signup OTP Verification',
            description: 'Email verification OTP for new user registration',
            subject: 'Verify Your Email Address',
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                otp: "123456",
                expiryMinutes: "15"
            }
        },
        {
            name: 'forgot-password-otp-verification',
            displayName: 'Forgot Password OTP Verification',
            description: 'Password reset verification email with OTP code',
            subject: 'Reset Your Password - Verification Code',
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                otp: "123456",
                expiryMinutes: "15"
            }
        },
        {
            name: 'email-change-verification',
            displayName: 'Email Change Verification',
            description: 'OTP verification for changing email address',
            subject: 'Verify Your New Email Address',
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                oldEmail: "old.email@example.com",
                newEmail: "new.email@example.com",
                otp: "123456",
                expiryMinutes: "15"
            }
        },
        {
            name: 'phone-change-verification',
            displayName: 'Phone Change Verification',
            description: 'OTP verification for changing phone number',
            subject: 'Verify Your Phone Number',
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                phoneNumber: "+91 98765 43210",
                otp: "123456",
                expiryMinutes: "10",
                isChange: true
            }
        },
        {
            name: 'account-deactivated',
            displayName: 'Account Deactivated',
            description: 'Notification email when account is deactivated',
            subject: 'Your Account Has Been Deactivated',
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                retentionDays: "30",
                reactivateUrl: "https://example.com/login"
            }
        },
        {
            name: 'order-confirmation',
            displayName: 'Order Confirmation',
            description: 'Order confirmation email with order details',
            subject: 'Order Confirmed - #{{orderNumber}}',
            previewContext: {
                firstName: "John",
                lastName: "Doe",
                orderNumber: "ORD-2024-001234",
                orderDate: "January 6, 2025",
                paymentMethod: "Credit Card",
                totalAmount: "1,999.00",
                currency: "₹",
                items: [
                    { name: "Premium Coffee Blend", quantity: 2, price: "599.00" },
                    { name: "Organic Tea Collection", quantity: 1, price: "799.00" }
                ],
                orderUrl: "https://example.com/orders/ORD-2024-001234"
            }
        },
        {
            name: 'contact-form',
            displayName: 'Contact Form',
            description: 'Contact form submission notification email',
            subject: 'New Contact Form Submission',
            previewContext: {
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "+91 98765 43210",
                subject: "Product Inquiry",
                message: "I would like to know more about your premium coffee blends and subscription options."
            }
        }
    ];

    constructor(
        public readonly nestTemplateLayoutService: NestTemplateLayoutService,
        public readonly nestTemplateService: NestTemplateService,
    ) { }

    private getMjmlBasePath(): string {
        // In production (webpack bundle), files are in dist/app/seeder/mjml
        // In development, files are in src/app/seeder/mjml
        const distPath = path.join(process.cwd(), 'dist', 'app', 'seeder', 'mjml');
        const srcPath = path.join(process.cwd(), 'src', 'app', 'seeder', 'mjml');

        // Check if dist path exists (production/built mode)
        if (fs.existsSync(distPath)) {
            return distPath;
        }
        // Fallback to src path (development mode)
        return srcPath;
    }

    private readMjmlFile(fileName: string): string {
        const filePath = path.join(this.getMjmlBasePath(), fileName);
        return fs.readFileSync(filePath, 'utf8');
    }

    private getLayoutContent(): string {
        return this.readMjmlFile('layouts/default.mjml');
    }

    private getTemplateContent(templateName: string): string {
        return this.readMjmlFile(`templates/${templateName}.mjml`);
    }

    async seed() {
        // Create default template layout
        try {
            await this.nestTemplateLayoutService.createTemplateLayout({
                name: 'default',
                type: 'email',
                displayName: `${process.env.APP_NAME} Default Layout`,
                description: 'Professional email layout with header, footer and dynamic content area',
                engine: TemplateEngineEnum.NUNJUCKS,
                language: TemplateLanguageEnum.MJML,
                content: this.getLayoutContent(),
                scope: 'system',
                previewContext: {
                    curruntYear: new Date().getFullYear()
                }
            });
            console.info('✅ Created template layout: default');
        } catch (error) {
            if (error.message?.includes('already exists')) {
                console.warn('⚠️  Template layout "default" already exists, skipping creation');
            } else {
                console.warn(`⚠️  Error creating template layout: ${error.message}, continuing...`);
            }
        }

        // Create all templates
        for (const template of this.templates) {
            try {
                await this.nestTemplateService.createTemplate({
                    name: template.name,
                    templateLayoutName: 'default',
                    type: 'email',
                    displayName: template.displayName,
                    description: template.description,
                    engine: TemplateEngineEnum.NUNJUCKS,
                    language: TemplateLanguageEnum.MJML,
                    content: this.getTemplateContent(template.name),
                    subject: template.subject,
                    scope: 'system',
                    previewContext: template.previewContext
                });
                console.info(`✅ Created template: ${template.name}`);
            } catch (error) {
                if (error.message?.includes('already exists')) {
                    console.warn(`⚠️  Template "${template.name}" already exists, skipping creation`);
                } else {
                    console.warn(`⚠️  Error creating template "${template.name}": ${error.message}, continuing...`);
                }
            }
        }
    }

    async drop() {
        await NestDynamicTemplate.getRepository().query(
            `TRUNCATE TABLE "${NestDynamicTemplate.getRepository().metadata.tableName}" CASCADE`,
        );
        await NestDynamicTemplateLayout.getRepository().query(
            `TRUNCATE TABLE "${NestDynamicTemplateLayout.getRepository().metadata.tableName}" CASCADE`,
        );
        console.info('🗑️  Truncated template tables');
        return;
    }

}
