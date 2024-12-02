import { snakeCase } from "lodash";
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from "typeorm";

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

    primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
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

    foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
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
}