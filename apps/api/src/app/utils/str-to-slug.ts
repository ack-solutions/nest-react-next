import { Not } from "typeorm";
import * as dotenv from 'dotenv';
import { join } from "path";
import { getDataSource } from "./database";


dotenv.parse(join(process.cwd(), '.env'));

export function convertToSlug(str) {
  str = str.replace(/[`~!@#$%^&*()_\-+=\\[\]{};:'"\\|\\/,.<>?\s]/g, ' ')
    .toLowerCase();
  str = str.replace(/^\s+|\s+$/gm, '');
  str = str.replace(/\s+/g, '-');
  return str;
}

export async function generateSlug(type, str: string, exclude?: number | string, slugColumnName = 'slug') {
  let index = 1;
  let found: any;
  let slug: string;
  do {
    slug = convertToSlug(str + (index > 1 ? ' ' + index : ''));
    const dataSource  = getDataSource();
    found = await dataSource
      .createQueryBuilder()
      .select('id')
      .from(type, 'slug_table')
      .withDeleted()
      .where({
        [slugColumnName]: slug,
        ...(exclude ? { id: Not(exclude) } : {})
      })
      .getRawOne();

    index++;
  } while (found);

  return slug;
}
