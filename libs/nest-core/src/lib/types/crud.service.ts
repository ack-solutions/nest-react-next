import { IFindOptions, IPaginationResult } from '@libs/types';
import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, SaveOptions } from 'typeorm';


export interface ICrudService<T> {
  getMany(criteria?: IFindOptions): Promise<IPaginationResult<T>>;
  getOne(criteria: string | number | FindOneOptions<T>): Promise<T>;
  create(entity: DeepPartial<T>, options?: SaveOptions): Promise<T>;
  update(criteria: string | number | FindOptionsWhere<T>, partialEntity: DeepPartial<T>): Promise<T>;
  count(filter?: FindManyOptions<T>): Promise<number>;
  delete(criteria: string | number | any): Promise<DeleteResult>;
  restore?(criteria: string | number | FindOptions<T>): Promise<DeleteResult>;
  trashDelete?(criteria: string | number | FindOptions<T>): Promise<DeleteResult>;
  bulkDelete?(criteria: Array<string | number> | FindOptions<T>): Promise<DeleteResult>;
}
