import { DataSource } from "typeorm";

export function getDataSource() {
    return global['dataSource'] as DataSource;
}

export function getDefaultRepository(entity) {
    const dataSource = getDataSource();
    return dataSource.getRepository(entity)
}
