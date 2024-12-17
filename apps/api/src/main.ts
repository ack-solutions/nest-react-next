
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();

    app.useStaticAssets(join(process.cwd(), 'public'), {
        prefix: '/public',
    });

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3333;
    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
}

bootstrap();
