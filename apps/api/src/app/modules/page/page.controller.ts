import { CrudController } from '@api/app/core/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Page } from './page.entity';
import { PageService } from './page.service';


@ApiTags('Page')
@Controller('page')
export class PageController extends CrudController(Page)<Page> {

    constructor(private readonly pageService: PageService) {
        super(pageService);
    }

}
