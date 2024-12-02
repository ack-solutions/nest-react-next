import { DataSource, DeepPartial, EntityTarget, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, QueryRunner, Repository, SaveOptions } from "typeorm";

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {

    baseRepository: Repository<Entity>;

    constructor(
        dataSource: DataSource,
        entity: EntityTarget<Entity>,
    ) {
        super(entity, dataSource.manager);
        this.baseRepository = dataSource.getRepository(entity);
        Object.assign(this, this.baseRepository);
    }


    private checkOrganizationIdColumn(): boolean {
    // Obtain the metadata for the entity
        const metadata = this.metadata;
        // Check if the `organizationId` column exists
        return metadata.columns.some(column => column.propertyName === 'organizationId');

    }

    private checkBusinessIdColumn(): boolean {
    // Obtain the metadata for the entity
        const metadata = this.metadata;
        // Check if the `businessId` column exists

        return metadata.columns.some(column => column.propertyName === 'businessId');
    }

    // private addOrganizationOrBusinessIdInObject(entity) {
    //   if (this.checkOrganizationIdColumn() && entity.organizationId === undefined) {
    //     const organizationId = RequestContext.currentOrganizationId() as any;
    //     entity.organizationId = organizationId;
    //   }

    //   if (this.checkBusinessIdColumn() && entity.businessId === undefined) {
    //     const businessId = RequestContext.currentBusinessId() as any;
    //     entity.businessId = businessId;
    //   }

    //   return entity;
    // }

    // private addConditionInWhere(where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]) {
    //   if (this.checkOrganizationIdColumn()) {
    //     const organizationId = RequestContext.currentOrganizationId() as any;
    //     where = {
    //       organizationId,
    //       ...where,
    //     } as any

    //   }

    //   if (this.checkBusinessIdColumn()) {
    //     const businessId = RequestContext.currentBusinessId() as any;
    //     where = {
    //       businessId,
    //       ...where,
    //     } as any
    //   }
    //   return where;
    // }


    async count(options?: FindManyOptions<Entity>) {

        options = {
            // where: this.addConditionInWhere(options?.where),
        }
        return this.baseRepository.count(options);
    }


    async findOne(options?: FindOneOptions<Entity>) {
        options = {
            ...options,
            // where: this.addConditionInWhere(options?.where)
        }
        return this.baseRepository.findOne(options);
    }


    async find(options?: FindManyOptions<Entity>) {
        options = {
            ...options,
            // where: this.addConditionInWhere(options?.where)
        }
        return this.baseRepository.find(options);
    }

    async findAndCount(options?: FindManyOptions<Entity>) {
        options = {
            // where: this.addConditionInWhere(options?.where)
        }
        return this.baseRepository.findAndCount(options);
    }

    create(entity?: DeepPartial<Entity> | DeepPartial<Entity>[]): any | any[] {
        if (entity instanceof Array) {
            // entity = entity?.map((entity) => this.addOrganizationOrBusinessIdInObject(entity))
        } else if (entity) {
            // entity = this.addOrganizationOrBusinessIdInObject(entity);
        } else {
            // entity = this.addOrganizationOrBusinessIdInObject({});
        }
        return this.baseRepository.create(entity as DeepPartial<Entity>);
    }

    async save(entity: any | any[], saveOptions: SaveOptions) {
        if (entity instanceof Array) {
            // entity = entity?.map((entity) => this.addOrganizationOrBusinessIdInObject(entity))
        } else {
            // entity = this.addOrganizationOrBusinessIdInObject(entity);
        }

        return this.baseRepository.save(entity, saveOptions)
    }


    createQueryBuilder(alias?: string, queryRunner?: QueryRunner) {

        const query = this.baseRepository.createQueryBuilder(alias, queryRunner)

        query.setFindOptions({
            // where: this.addConditionInWhere({})
        })

        return query;
    }
}
