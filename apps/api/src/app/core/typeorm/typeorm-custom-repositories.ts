import { DataSource, Repository } from 'typeorm';

import { BaseRepository } from './base-repository';


// Override the getRepository method globally
DataSource.prototype.getRepository = function <Entity>(
    entity: any,
): Repository<Entity> {
    return new BaseRepository(entity, this.manager);
};
