
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  SaveOptions,
} from 'typeorm';
import { ICrudService } from '../types/crud.service';
import { FindQueryBuilder } from './find-query-builder';
// import { IFindOptions, IPaginationResult } from '@ackplus-inventory/core/types';
import { RequestContext } from '../request-context/request-context';
import { cloneDeep, has } from 'lodash';
import { IFindOptions, IPaginationResult } from '@mlm/types';
// import { FileStorage } from '../module/file-storage';
import { BaseEntity } from '../typeorm/base.entity';
// import { FileStorage } from '../file-storage';


export abstract class CrudService<T extends BaseEntity> implements ICrudService<T> {

  protected hasSoftDelete = false;
  protected useQueryBuilder = false;
  protected softDeleteField = 'isDeleted';
  protected fileFields = [];

  protected constructor(public readonly repository: Repository<T>) {

  }


  protected async beforeSave(entity: T, _request?: any) {
    return entity;
  }

  protected async afterSave(_oldValue: T, newValue?: T) {
    return newValue;
  }

  public async count(filter?: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(filter);
  }

  public async getMany(filter: IFindOptions): Promise<IPaginationResult<T>> {
    filter.where = this.mapUserIdInWhereForUser(filter.where as any, 'getMany');
    const builder = new FindQueryBuilder(this.repository, filter)
    builder.createDistinctQuery()
    this.doGetMany(builder, filter)
    const total = await builder.getCount();
    const items = await builder.getMany();
    return { items, total: total?.count || 0 };
  }


  public async getOne(
    criteria: string | number | FindOneOptions<T>
  ): Promise<T> {
    if (typeof criteria === 'string' || typeof criteria === 'number') {
      criteria = { where: { id: criteria as any } }
    }
    criteria.where = this.mapUserIdInWhereForUser(criteria.where, 'getOne');
    return this.repository.findOne(criteria as FindOneOptions<T>);
  }

  public async create(entity: DeepPartial<T>, options?: SaveOptions): Promise<T> {

    entity = await this.checkOwnRowForUser(entity, false, 'create');
    let obj = this.repository.create(entity);
    try {
      const oldValue = cloneDeep(obj);
      obj = await this.beforeSave(obj, entity);
      await this.repository.save(obj as any, options);

      await this.afterSave(oldValue, obj);
      return obj
    } catch (err) {
      throw new BadRequestException(err);
    }
  }


  public async update(
    criteria: string | number | FindOptionsWhere<T>,
    partialEntity: DeepPartial<T>
  ): Promise<T> {
    try {
      let findCondition;
      if (typeof criteria === 'string' || typeof criteria === 'number') {
        findCondition = { id: criteria };
      } else {
        findCondition = criteria;
      }

      let record = await this.repository.findOne({ where: findCondition });

      if (!record) {
        throw new BadRequestException("No Record Found");
      }

      record = await this.checkOwnRowForUser(record, true, 'update') as T;

      const oldValue = cloneDeep(record);

      let obj: any = this.repository.create({
        ...record,
        ...partialEntity,
        updatedAt: new Date()
      });


      obj = await this.beforeSave(obj, partialEntity);


      await this.repository.save(obj);
      await this.handleFileDelete(record, obj);
      await this.afterSave(oldValue, obj);
      return obj;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  public async delete(
    criteria: string | number | FindOptionsWhere<T>
  ): Promise<DeleteResult> {
    try {

      if (typeof criteria === 'string' || typeof criteria === 'number') {
        criteria = { id: criteria as any }
      }

      const record = await this.repository.findOne({ where: criteria });
      await this.checkOwnRowForUser(record, true, 'delete');


      if (this.repository.metadata.deleteDateColumn) {
        return await this.repository.softDelete(criteria);
      } else {

        await this.handleFileDelete(record);

        return await this.repository.delete(criteria);
      }
    } catch (err) {
      throw new NotFoundException(`The record was not found`, err);
    }
  }


  protected doGetMany(_builder: FindQueryBuilder<T>, _filter?: IFindOptions) {
    // Nothing
  }


  protected isUserRole() {
    // const user = RequestContext.currentUser();
    // return !some(user?.roles, ({ name }) => {
    //   return (RoleNameEnum.ADMIN === name || RoleNameEnum.SUPER_ADMIN === name)
    // })

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async checkOwnRowForUser(entity: DeepPartial<T>, throwError?: boolean, _hookType?: 'create' | 'update' | 'delete') {
    const user = RequestContext.currentUser();
    const hasUserIdColumn = this.repository.metadata.columns.filter((column) => column.propertyName === 'userId')?.length > 0;
    if (this.isUserRole() && hasUserIdColumn) {
      if (throwError && has(entity, 'userId') && (entity as any).userId != user?.id) {
        throw new BadRequestException("You are not authorized.")
      } else {
        (entity as any).userId = user?.id
      }
    }
    return entity;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected mapUserIdInWhereForUser(where: FindOptionsWhere<T> | FindOptionsWhere<T>[], _hookType: 'getMany' | 'getOne') {
    const user = RequestContext.currentUser()
    const hasUserIdColumn = this.repository.metadata.columns.filter((column) => column.propertyName === 'userId')?.length > 0;
    if (this.isUserRole() && hasUserIdColumn) {
      if (where instanceof Array && where.length > 0) {
        where?.push({
          userId: user?.id,
        } as any)
      }
      else if (typeof where === 'object') {
        where = {
          ...where,
          userId: user?.id, // Add the condition to filter by user ID
        } as any;
      }
      else {
        where = { userId: user?.id } as any;
      }
    }
    return where
  }

  async handleFileDelete(oldValue: T, newValue?: T) {
    for (let index = 0; index < this.fileFields.length; index++) {
      const fieldName = this.fileFields[index];

      if ((!newValue || newValue[fieldName] === null || newValue[fieldName] === '' || oldValue[fieldName] !== newValue[fieldName]) && oldValue[fieldName]) {
        // const fileStorage = new FileStorage();
        try {
          console.log('handleFileDelete', oldValue[fieldName]);
          // await fileStorage.getProvider()?.deleteFile(oldValue[fieldName])
        } catch (error) {
          console.log('delete error', error);
        }
      }
    }
  }
}