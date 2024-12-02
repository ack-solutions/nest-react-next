import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageMiddleware } from './file-storage.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([]), ConfigModule.forRoot()],
    controllers: [],
    providers: [FileStorageMiddleware],
})
export class FileStorageModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(FileStorageMiddleware).forRoutes('*');
    }
}
