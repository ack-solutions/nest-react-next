import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { Repository } from 'typeorm';
import { CrudService } from '@api/app/core/crud';

@Injectable()
export class PageService extends CrudService<Page> {
    constructor(
        @InjectRepository(Page)
        private pageRepo: Repository<Page>
    ) {
        super(pageRepo);
    }

    find() {
        return this.pageRepo.find();
    }
}
