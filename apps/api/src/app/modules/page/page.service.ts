import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { Page } from './page.entity';
import { BaseService } from '../../core/service/base-service';


@Injectable()
export class PageService extends BaseService<Page> {

    constructor(
        @InjectRepository(Page)
        repository: Repository<Page>,
    ) {
        super(repository);
    }

    byIdOrSlug(id: string) {
        const query = this.repository.createQueryBuilder();

        query.where(`"${query.alias}"."slug" = :slug`, { slug: id });
        query.orWhere(`"${query.alias}"."id"::text = :id`, { id });
        return query.getOne();
    }

}
