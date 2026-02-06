import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as bodyParser from 'body-parser';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { DatabaseErrorFilter } from './app/core/filters/database-error.filter';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: [
            process.env.FRONT_URL,
            process.env.ADMIN_URL,
            process.env.API_URL,
        ].filter(Boolean),
        credentials: true,
    });

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    // Register global exception filter
    app.useGlobalFilters(new DatabaseErrorFilter());

    app.useStaticAssets(join(process.cwd(), 'apps/api/public'), {
        prefix: '/public',
    });

    // Enable extended query parser to support nested objects
    app.set('query parser', 'extended');
    // Increase body size limit isssue when file upload
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
    }));

    app.useGlobalPipes(
        new ValidationPipe({
            forbidUnknownValues: true,
            transform: true, // Automatically transform payloads to match DTO classes
            transformOptions: {
                enableImplicitConversion: true, // Allows for implicit conversion based on the type of the target property
            },
        }),
    );

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Inventory Management API')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        })
        .addServer('http://localhost:3333', 'Local Development')
        .addServer('https://api.ackbiz.com', 'Production')
        .addServer('https://api.dev.ackbiz.com', 'Development')
        .setContact('Support Team', 'https://ackplus.com', 'contact@ackplus.com')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    // Custom swagger UI options
    SwaggerModule.setup('api/swagger', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            docExpansion: 'none',
            filter: true,
        },

        customSiteTitle: 'Inventory Management API Docs',
        customfavIcon: '/public/favicon.ico',
        customCss: `
            .swagger-ui .topbar { display: none }
        `,
    });

    app.use(
        'api/docs',
        apiReference({
            content: document,
            defaultHttpClient: {
                targetKey: 'js',
                clientKey: 'axios',
            },
        }),
    );

    const port = process.env.PORT || 3333;
    await app.listen(port);

    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
}

bootstrap();
