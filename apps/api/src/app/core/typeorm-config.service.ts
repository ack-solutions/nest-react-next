import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TlsOptions } from 'tls';
import { entities } from './entities';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService,) { }
    
    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        let options: any;


        const dbType = process.env.DATABASE_TYPE || 'postgres';


        if (dbType == 'postgres') {
            const allEntities = entities;

            const isSSL = process.env.DATABASE_SSL_MODE && process.env.DATABASE_SSL_MODE !== 'false';

            let sslParams: TlsOptions;

            if (isSSL) {
                sslParams = {
                    rejectUnauthorized: false,
                    // ca: readFileSync(join(__dirname, "assets", "ca-certificate.crt")).toString()
                }
            }

            options = {
                ssl: isSSL ? sslParams : false,
                type: dbType,
                host: process.env.DATABASE_HOST || 'localhost',
                username: process.env.DATABASE_USER || 'postgres',
                password: process.env.DATABASE_PASSWORD || 'root',
                database: process.env.DATABASE_NAME,
                port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
                entities: allEntities,
                synchronize: true,
                logging: true,
                logger: 'file', //Removes console logging, instead logs all queries in a file ormlogs.log
                uuidExtension: 'pgcrypto',
            } as TypeOrmModuleOptions;

            console.log("database config", options);

            console.log('DB Type configured: ' + dbType);

        } else {
            throw new Error(`Critical: DB of type ${dbType} not supported yet`);
        }

        return options;
    }

}
