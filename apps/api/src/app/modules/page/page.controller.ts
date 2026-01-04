import { NestAuthAuthGuard } from '@ackplus/nest-auth';
import { Crud } from '@ackplus/nest-crud';
import { Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


import { PageDTO } from './dto/page.dto';
import { Page } from './page.entity';
import { PageService } from './page.service';


@ApiTags('Page')
@UseGuards(NestAuthAuthGuard)
@Crud({
    entity: Page,
    name: 'Page',
    path: 'page',
    softDelete: true,
    dto: {
        create: PageDTO,
        update: PageDTO,
    },
})
export class PageController {

    constructor(
        private service: PageService,
    ) {
    }


    @ApiOperation({ summary: 'Get By Slug' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
    })
    @Get('slug-or-id/:id')
    async byIdOrSlug(@Param('id') id: string) {
        return this.service.byIdOrSlug(id);
    }

}
