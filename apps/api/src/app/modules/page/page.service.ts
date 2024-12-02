import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '@api/app/core/crud';
import { IPage } from '@libs/types';
import { Page } from './page.entity';


@Injectable()
export class PageService extends CrudService<IPage> {
    constructor(
    @InjectRepository(Page)
        repository: Repository<Page>
    ) {
        super(repository);
    }
}
