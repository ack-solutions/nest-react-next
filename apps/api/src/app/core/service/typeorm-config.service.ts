import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import path, { resolve } from 'path';
import { TlsOptions } from 'tls';

import { IDatabaseConfig } from '../../config/database';
import { ALL_ENTITIES } from '../../entities';
import { CustomNamingStrategy } from '../typeorm/custom-naming-strategy';
import '../typeorm/typeorm-custom-repositories';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    constructor(
        private configService: ConfigService,
    ) { }

    createTypeOrmOptions() {
        const isTestEnv = process.env.NODE_ENV === 'test';
        const isLocalEnv = process.env.NODE_ENV === 'local';

        const appConfig = this.configService.get('app');
        const database = this.configService.get<IDatabaseConfig>('database');

        const options = {
            type: database?.type,
            ssl: database?.sslMode ?
                ({
                    rejectUnauthorized: true,
                    ca: readFileSync(resolve(database?.sslCaPath)).toString(),
                } as TlsOptions) :
                false,
            host: database?.host,
            username: database?.username,
            password: database?.password,
            database: isTestEnv ? `${database?.name}_test` : database?.name,
            port: database?.port,
            entities: ALL_ENTITIES,
            synchronize: true,
            logging: !appConfig?.isProd,
            logger: 'file',
            uuidExtension: 'pgcrypto',
            namingStrategy: new CustomNamingStrategy(),
            dropSchema: isTestEnv, // Clean the schema for tests
            migrationsRun: !isLocalEnv, // Automatically run migrations if not local
            migrations: [path.join(process.cwd(), 'apps/api/src/migrations/generated')],
        } as TypeOrmModuleOptions;

        return options;
    }

}
