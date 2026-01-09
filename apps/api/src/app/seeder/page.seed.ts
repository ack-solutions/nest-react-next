import { PageStatusEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseRepository } from '../core/typeorm/base-repository';
import { Seeder } from '@ackplus/nest-seeder';
import { Page } from '../modules/page/page.entity';


@Injectable()
export class PageSeeder implements Seeder {

    constructor(
        @InjectRepository(Page)
        private pageRepository: BaseRepository<Page>,
    ) { }

    async seed() {
        const existingPages = await this.pageRepository.find();
        const existingSlugs = existingPages.map(page => page.slug);

        const pages = [
            {
                title: 'Terms and Conditions',
                name: 'terms-and-conditions',
                slug: 'terms-and-conditions',
                status: PageStatusEnum.PUBLISHED,
                content: `
                    <h1>Terms and Conditions</h1>

                    <h2>1. Introduction</h2>
                    <p>Welcome to our website. These terms and conditions outline the rules and regulations for the use of our website.</p>

                    <h2>2. Acceptance of Terms</h2>
                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h2>3. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>

                    <h2>4. Disclaimer</h2>
                    <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                    <h2>5. Limitations</h2>
                    <p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>

                    <h2>6. Accuracy of Materials</h2>
                    <p>The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current.</p>

                    <h2>7. Links</h2>
                    <p>We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.</p>

                    <h2>8. Modifications</h2>
                    <p>We may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>

                    <h2>9. Governing Law</h2>
                    <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>

                    <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
                `,
            },
            {
                title: 'Privacy Policy',
                name: 'privacy-policy',
                slug: 'privacy-policy',
                status: PageStatusEnum.PUBLISHED,
                content: `
                    <h1>Privacy Policy</h1>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process transactions and send related information</li>
                        <li>Send technical notices, updates, security alerts, and support messages</li>
                        <li>Respond to your comments, questions, and customer service requests</li>
                        <li>Communicate with you about products, services, offers, and events</li>
                    </ul>

                    <h2>3. Information Sharing</h2>
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

                    <h2>4. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

                    <h2>5. Cookies</h2>
                    <p>We use cookies and similar tracking technologies to collect and use personal information about you. You can control cookies through your browser settings.</p>

                    <h2>6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your information</li>
                        <li>Object to processing of your information</li>
                        <li>Request data portability</li>
                    </ul>

                    <h2>7. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at privacy@yourcompany.com</p>

                    <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
                `,
            },
            {
                title: 'About Us',
                name: 'about-us',
                slug: 'about-us',
                status: PageStatusEnum.PUBLISHED,
                content: `
                    <h1>About Us</h1>

                    <h2>Our Story</h2>
                    <p>Founded with a vision to revolutionize the way businesses operate, our company has been at the forefront of innovation and excellence. We believe in delivering exceptional value to our customers through cutting-edge solutions and unparalleled service.</p>

                    <h2>Our Mission</h2>
                    <p>To empower businesses with innovative technology solutions that drive growth, efficiency, and success. We are committed to building lasting partnerships with our clients and helping them achieve their goals.</p>

                    <h2>Our Vision</h2>
                    <p>To be the leading provider of technology solutions that transform businesses and create meaningful impact in the world.</p>

                    <h2>Our Values</h2>
                    <ul>
                        <li><strong>Innovation:</strong> We constantly push boundaries and explore new possibilities</li>
                        <li><strong>Excellence:</strong> We strive for perfection in everything we do</li>
                        <li><strong>Integrity:</strong> We conduct business with honesty and transparency</li>
                        <li><strong>Collaboration:</strong> We believe in the power of teamwork and partnership</li>
                        <li><strong>Customer Focus:</strong> Our customers' success is our success</li>
                    </ul>

                    <h2>Our Team</h2>
                    <p>Our diverse team of experts brings together years of experience in technology, business, and innovation. We are passionate about what we do and committed to delivering exceptional results for our clients.</p>

                    <h2>Contact Information</h2>
                    <p>Ready to work with us? Get in touch today to learn more about how we can help your business succeed.</p>
                `,
            },
            {
                title: 'Contact Us',
                name: 'contact-us',
                slug: 'contact-us',
                status: PageStatusEnum.PUBLISHED,
                content: `
                    <h1>Contact Us</h1>

                    <p>We'd love to hear from you! Get in touch with us using any of the methods below.</p>

                    <h2>Get in Touch</h2>

                    <h3>Office Address</h3>
                    <p>
                        123 Business Street<br>
                        Suite 100<br>
                        City, State 12345<br>
                        Country
                    </p>

                    <h3>Phone</h3>
                    <p>
                        <strong>Main:</strong> +1 (555) 123-4567<br>
                        <strong>Support:</strong> +1 (555) 123-4568<br>
                        <strong>Sales:</strong> +1 (555) 123-4569
                    </p>

                    <h3>Email</h3>
                    <p>
                        <strong>General:</strong> info@yourcompany.com<br>
                        <strong>Support:</strong> support@yourcompany.com<br>
                        <strong>Sales:</strong> sales@yourcompany.com<br>
                        <strong>Careers:</strong> careers@yourcompany.com
                    </p>

                    <h3>Business Hours</h3>
                    <p>
                        <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br>
                        <strong>Saturday:</strong> 10:00 AM - 4:00 PM<br>
                        <strong>Sunday:</strong> Closed
                    </p>

                    <h2>Send us a Message</h2>
                    <p>Have a question or want to discuss a project? Fill out our contact form and we'll get back to you within 24 hours.</p>

                    <h2>Follow Us</h2>
                    <p>Stay connected with us on social media for the latest updates, news, and insights.</p>
                `,
            },
            {
                title: 'Cookie Policy',
                name: 'cookie-policy',
                slug: 'cookie-policy',
                status: PageStatusEnum.PUBLISHED,
                content: `
                    <h1>Cookie Policy</h1>

                    <h2>What Are Cookies</h2>
                    <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.</p>

                    <h2>How We Use Cookies</h2>
                    <p>We use cookies for several reasons:</p>
                    <ul>
                        <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
                        <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website</li>
                        <li><strong>Functionality Cookies:</strong> These remember your preferences and personalize your experience</li>
                        <li><strong>Marketing Cookies:</strong> These are used to deliver relevant advertisements</li>
                    </ul>

                    <h2>Types of Cookies We Use</h2>

                    <h3>Strictly Necessary Cookies</h3>
                    <p>These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.</p>

                    <h3>Analytics Cookies</h3>
                    <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are most and least popular.</p>

                    <h3>Functional Cookies</h3>
                    <p>These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</p>

                    <h2>Managing Cookies</h2>
                    <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>

                    <h2>Contact Us</h2>
                    <p>If you have any questions about our use of cookies, please contact us at privacy@yourcompany.com</p>

                    <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
                `,
            },
        ];

        // Only seed pages that don't already exist
        const pagesToSeed = pages.filter(page => !existingSlugs.includes(page.slug));

        if (pagesToSeed.length > 0) {
            await this.pageRepository.save(pagesToSeed);
            console.info(`✅ Seeded ${pagesToSeed.length} pages: ${pagesToSeed.map(p => p.title).join(', ')}`);
        } else {
            console.info('✅ All default pages already exist');
        }

        return pagesToSeed;
    }

    async drop() {
        const defaultSlugs = [
            'terms-and-conditions',
            'privacy-policy',
            'about-us',
            'contact-us',
            'cookie-policy',
        ];

        await this.pageRepository
            .createQueryBuilder()
            .delete()
            .where('slug IN (:...slugs)', { slugs: defaultSlugs })
            .execute();

        console.info('🗑️ Dropped default pages');
    }

}
