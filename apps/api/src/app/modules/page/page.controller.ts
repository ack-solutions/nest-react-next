
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { IPage } from '@libs/types';
import { CrudController } from '@api/app/core/crud';
import { PageDTO } from './dto/page.dto';
import { PageService } from './page.service';

@ApiTags('Page')
@Controller("page")
@UseGuards(AuthGuard('jwt'))
export class PageController extends CrudController(PageDTO)<IPage> {
    constructor(private pageService: PageService) {
        super(pageService);
    }
}
