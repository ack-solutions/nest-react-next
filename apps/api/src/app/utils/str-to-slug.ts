import { Not } from "typeorm";
import * as dotenv from 'dotenv';
import { join } from "path";
import { getDataSource } from "./database";


dotenv.parse(join(process.cwd(), '.env'));

export function convertToSlug(str) {

  //replace all special characters | symbols with a space
  str = str.replace(/[`~!@#$%^&*()_\-+=\\[\]{};:'"\\|\\/,.<>?\s]/g, ' ')
    .toLowerCase();

  // trim spaces at start and end of string
  str = str.replace(/^\s+|\s+$/gm, '');

  // replace space with dash/hyphen
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

export function getEnv(key: string, defaultValue: any = null) {
  return process.env[key] || defaultValue;
}



export function generateToken() {
  let token = '';
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let index = 0; index < 32; index++) {
    const char = Math.floor(Math.random() * str?.length + 1);
    token += str.charAt(char)
  }
  return token;
}

export async function generateRandomNumber(limit = 6) {

  const min = Math.pow(10, (limit - 1));
  const max = Math.pow(10, limit) - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp;
}

export function hexToRgbA(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  }
  throw new Error('Bad Hex');
}

export function camelCase(str) {
  return str
    .replace(/\s(.)/g, function (a) {
      return a.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function (b) {
      return b.toLowerCase();
    });
}



export function getBoolean(value) {
  switch (value) {
    case true:
    case "true":
    case 1:
    case "1":
    case "on":
    case "yes":
      return true;
    default:
      return false;
  }
}