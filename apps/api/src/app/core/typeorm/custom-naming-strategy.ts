import { snakeCase } from 'lodash';
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';


export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

    override primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
        let tableName: string;
        if (tableOrName instanceof Table) {
            tableName = tableOrName.name;
        } else {
            tableName = tableOrName;
        }
        const columnHash = columnNames.reduce((acc, cur) => acc + cur, '');
        const hashedColumnNames = `${snakeCase(columnHash)}`;

        return `pk_${snakeCase(tableName)}_${hashedColumnNames}`;
    }

    override indexName(tableOrName: Table | string, columnNames: string[]): string {
        let tableName: string;
        if (tableOrName instanceof Table) {
            tableName = tableOrName.name;
        } else {
            tableName = tableOrName;
        }
        const columnHash = columnNames.reduce((acc, cur) => acc + cur, '');
        const hashedColumnNames = `${snakeCase(columnHash)}`;
        return `idx_${snakeCase(tableName)}_${hashedColumnNames}`;
    }


    override foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
        let tableName: string;
        if (tableOrName instanceof Table) {
            tableName = tableOrName.name;
        } else {
            tableName = tableOrName;
        }
        const columnHash = columnNames.reduce((acc, cur) => acc + cur, '');
        const hashedColumnNames = `${snakeCase(columnHash)}`;
        return `fk_${snakeCase(tableName)}_${hashedColumnNames}`;
    }

    override uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
        let tableName: string;
        if (tableOrName instanceof Table) {
            tableName = tableOrName.name;
        } else {
            tableName = tableOrName;
        }
        const columnHash = columnNames.reduce((acc, cur) => acc + cur, '');
        const hashedColumnNames = `${snakeCase(columnHash)}`;
        return `uq_${snakeCase(tableName)}_${hashedColumnNames}`;
    }

}
