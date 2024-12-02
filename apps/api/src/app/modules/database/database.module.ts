import { DynamicModule, Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

interface EntityRepositoryPair {
  entity: any;
  repository: any;
}

export type DatabaseForFeatureOptions = EntityRepositoryPair[] | any[];

@Global()
@Module({})
export class DatabaseModule {
    static forFeature(entities: any[]): DynamicModule {

        const providers = entities
            .map((entity) => {
                return {
                    provide: `${entity.name}Repository`,
                    useFactory: (dataSource: DataSource) => {
                        const repo = new BaseRepository(dataSource, entity);
                        return repo;
                    },
                    inject: [DataSource],
                }
            }).filter((value) => Boolean(value));

        return {
            module: DatabaseModule,
            imports: [TypeOrmModule.forFeature(entities)],
            providers: providers,
            exports: [...providers, TypeOrmModule],
        };
    }
}