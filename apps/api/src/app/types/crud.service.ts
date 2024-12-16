import { IFindOptions, IPaginationResult } from '@libs/types';
import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, SaveOptions, UpdateResult } from 'typeorm';


export interface ICrudService<T> {
    getAll(criteria?: IFindOptions): Promise<T[]>;
    getMany(criteria?: IFindOptions): Promise<IPaginationResult<T>>;
    getOne(criteria: string | number | FindOneOptions<T>): Promise<T>;
    create(entity: DeepPartial<T>, options?: SaveOptions): Promise<T>;
    update(criteria: string | number | FindOptionsWhere<T>, partialEntity: DeepPartial<T>): Promise<T>;
    count(filter?: FindManyOptions<T>): Promise<number>;
    delete(criteria: string | number | FindOptionsWhere<T>): Promise<DeleteResult>;
    restore?(criteria: string | number | FindOptionsWhere<T>): Promise<UpdateResult>;
    permanentDelete?(criteria: string | number | FindOptionsWhere<T>): Promise<DeleteResult>;
}
