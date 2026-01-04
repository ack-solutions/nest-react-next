import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';


export function getDataSource(): DataSource {
    return (global as any).dataSource as DataSource;
}

export function getDefaultRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    const dataSource = getDataSource();
    return dataSource.getRepository(entity);
}
