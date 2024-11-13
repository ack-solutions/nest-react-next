import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TlsOptions } from 'tls';
import { IDatabaseConfig } from '../types/database-config';
import { CustomNamingStrategy } from '../typeorm/custom-naming-strategy';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    constructor(
        private configService: ConfigService,
    ) { }

    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {

        const appConfig = this.configService.get('app');
        const database = this.configService.get<IDatabaseConfig>('database');

        const options = {
            type: database?.type,
            ssl: database?.sslMode ? {
                rejectUnauthorized: true,
                ca: readFileSync(resolve(database?.sslCaPath)).toString()
            } as TlsOptions : false,
            host: database?.host,
            username: database?.username,
            password: database?.password,
            database: database?.name,
            port: database?.port,
            synchronize: true,
            logging: !appConfig?.isProd,
            logger: 'file',
            uuidExtension: 'pgcrypto',
            namingStrategy: new CustomNamingStrategy()
        } as TypeOrmModuleOptions;

        return options;
    }

}
