import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm';


export class BaseRepository<Entity> extends Repository<Entity> {

    /**
     * Create or update an entity based on unique constraints.
     *
     * @param criteria The criteria to find the existing entity (e.g., { id } or { uniqueField: value }).
     * @param newData The data to create or update the entity.
     * @returns The saved entity.
     */
    async createOrUpdate(
        criteria: FindOptionsWhere<Entity>,
        entityData: Partial<Entity> | DeepPartial<Entity>,
    ): Promise<Entity> {
        // Find the existing entity based on criteria
        let entity = (await this.findOne({ where: criteria })) as Entity;

        if (entity) {
            // Update the entity with new data
            entity = this.merge(entity, entityData as DeepPartial<Entity>);
        } else {
            // Create a new entity if not found
            entity = this.create(entityData as DeepPartial<Entity>);
        }

        // Save the entity (handles both create and update)
        return this.save(entity);
    }

    /**
     * Find an entity by the given criteria, or create it if it doesn't exist.
     *
     * @param where The criteria to find the existing entity.
     * @param createData The data to create a new entity if not found.
     * @returns The found or newly created entity.
     */
    async findOrCreate(
        where: FindOptionsWhere<Entity>,
        createData: Partial<Entity>,
    ): Promise<Entity> {
        // Attempt to find the entity by the criteria
        let entity = (await this.findOneBy(where)) as Entity;

        // If not found, create and save a new entity
        if (!entity) {
            entity = this.create(createData as Entity);
            await this.save(entity);
        }

        // Return the found or created entity
        return entity;
    }

    /**
     * Sync many-to-many relationships by matching with an array of objects.
     *
     * @param relatedEntities Array of objects to match or create related entities.
     * @param relatedEntityRepo The repository for the related entity.
     * @param createEntityFn A callback to generate new related entity objects.
     * @param matchFn A callback to generate the matching criteria from the input object (optional).  Defaults to using the same fields as createEntityFn.
     * @returns The saved related entities (existing + newly created).
     */
    async syncRelations<RelatedEntity>(
        relatedEntities: Partial<RelatedEntity>[],
        relatedEntityRepo: Repository<RelatedEntity>,
        createEntityFn: (
            entity: Partial<RelatedEntity>
        ) => Partial<RelatedEntity>,
        matchFn?: (
            entity: Partial<RelatedEntity>
        ) => FindOptionsWhere<RelatedEntity>,
    ): Promise<RelatedEntity[]> {
        // Default matchFn to createEntityFn if not provided
        matchFn = matchFn || (createEntityFn as any);

        if (relatedEntities.length === 0) {
            return [];
        }

        // Generate matching criteria for all input entities
        const matchingCriteria = relatedEntities.map(matchFn);

        // Find existing entities based on the matching criteria
        const existingEntities = await relatedEntityRepo.find({
            where: matchingCriteria,
        });

        // Determine new entities to create by excluding matches
        const existingEntitySet = new Set(
            existingEntities.map((e) => JSON.stringify(matchFn(e))),
        );

        const newEntities = relatedEntities
            .filter(
                (entity) => !existingEntitySet.has(JSON.stringify(matchFn(entity))),
            )
            .map((entity) => relatedEntityRepo.create(
                createEntityFn(entity) as RelatedEntity,
            ));

        //  Save new related entities
        await relatedEntityRepo.save(newEntities as RelatedEntity[]);

        //  Return all related entities (existing + newly saved)
        return [...existingEntities, ...(newEntities as RelatedEntity[])];
    }

    /**
     * Generalized function to sync many-to-many relationships without explicitly specifying the related repository.
     *
     * @param entity The main entity to sync relationships for.
     * @param relatedEntityNames Names/identifiers of related entities to sync.
     * @param relationKey The property key on the main entity for the relation (e.g., "tags").
     * @param createEntityFn A callback function to create new related entities.
     * @returns The updated main entity with the synchronized relationship.
     */
    async syncManyToMany<Entity>(
        entity: Partial<Entity>,
        relationKey: keyof Entity,
        relatedEntityNames: string[],
        createEntityFn: (name: string) => any,
    ) {
        // Get metadata for the main entity
        const metadata = this.manager.connection.getMetadata(this.target);

        // Get relation metadata for the specified relation key
        const relation = metadata.relations.find(
            (rel) => rel.propertyName === relationKey,
        );

        if (!relation) {
            throw new Error(
                `Relation '${String(relationKey)}' not found on entity ${metadata.name
                }`,
            );
        }

        // Get the repository for the related entity
        const relatedEntityRepository = this.manager.getRepository(
            relation.type as any,
        );

        // Find existing related entities
        const existingEntities = await relatedEntityRepository.find({
            where: { name: In(relatedEntityNames) } as any, // Assuming "name" is the unique identifier
        });

        // Create new related entities for names that don't exist
        const existingEntityNames = new Set(
            existingEntities.map((e: any) => e.name),
        );
        const newEntities = relatedEntityNames
            .filter((name) => !existingEntityNames.has(name))
            .map((name) => relatedEntityRepository.create(createEntityFn(name)));

        // Save new entities in bulk
        const savedNewEntities = await relatedEntityRepository.save(
            newEntities,
        );

        // Combine existing and new related entities
        const allRelatedEntities = [...existingEntities, ...savedNewEntities];

        // Assign the related entities to the relationKey of the main entity
        (entity[relationKey] as unknown) = allRelatedEntities;

        return entity;
    }

}
