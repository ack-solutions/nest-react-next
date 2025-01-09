import { Not } from "typeorm";

import { getDataSource } from "./database";


export async function generateRandomUnpickString(type, limit = 6, ColumnName: string) {
    let found: any;
    let dealId: any;
    do {
        const min = Math.pow(10, (limit - 1));
        const max = Math.pow(10, limit) - 1;
        dealId = Math.floor(Math.random() * (max - min + 1)) + min;
        const dataSource  = getDataSource();
        found = await dataSource
            .createQueryBuilder()
            .select()
            .from(type, 'slug_table')
            .where({
                [ColumnName]: Not(dealId),
            })
            .getOne();
  
  
  
    } while (found > 0);
  
    return dealId;
}