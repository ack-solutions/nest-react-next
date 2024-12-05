import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageService } from './page.service';
import { CrudController } from '@api/app/core/crud';
import { Page } from './page.entity';

@ApiTags('Page')
@Controller('page')
export class PageController extends CrudController(Page)<Page> {
    constructor(private readonly pageService: PageService) {
        super(pageService);
    }
}
