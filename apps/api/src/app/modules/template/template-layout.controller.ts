import { NestAuthAuthGuard } from '@ackplus/nest-auth';
import { RenderContentTemplateLayoutDto } from '@ackplus/nest-dynamic-templates';
import { NestDynamicTemplateLayout } from '@ackplus/nest-dynamic-templates';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CreateTemplateLayoutDto } from './dto/create-template-layout.dto';
import { UpdateTemplateLayoutDto } from './dto/update-template-layout.dto';
import { TemplateLayoutService } from './template-layout.service';
import { SuccessDTO } from '../../core/dto/success.dto';


@ApiTags('Template Layout')
@UseGuards(NestAuthAuthGuard)
@Controller('template-layout')
export class TemplateLayoutController {

    constructor(private templateLayoutService: TemplateLayoutService) { }

    @ApiOperation({ summary: 'Render template layout' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'Render template layout',
    })
    @Post('render')
    async renderTemplateLayout(@Body() input: RenderContentTemplateLayoutDto) {
        return this.templateLayoutService.renderTemplateLayout(input);
    }

    @ApiOperation({ summary: 'Get all template layouts' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: [NestDynamicTemplateLayout],
        description: 'Get all template layouts',
    })
    @Get('/')
    async getTemplateLayouts(@Query() filter: any) {
        return this.templateLayoutService.getTemplateLayouts(filter);
    }

    @ApiOperation({ summary: 'Get template layout by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: NestDynamicTemplateLayout,
        description: 'Get template layout by id',
    })
    @Get(':id')
    async getTemplateLayout(
        @Param('id') id: string,
    ) {
        return this.templateLayoutService.getTemplateLayoutById(id);
    }

    @ApiOperation({ summary: 'Create template layout' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: NestDynamicTemplateLayout,
        description: 'Create template layout',
    })
    @Post('')
    @Throttle({
        default: {
            limit: 5,
            ttl: 60,
        },
    })
    async createTemplateLayout(@Body() templateLayout: CreateTemplateLayoutDto) {
        return this.templateLayoutService.createTemplateLayout(templateLayout);
    }

    @ApiOperation({ summary: 'Update template layout' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: NestDynamicTemplateLayout,
        description: 'Update template layout',
    })
    @Put(':id')
    async updateTemplateLayout(@Param('id') id: string, @Body() templateLayout: UpdateTemplateLayoutDto) {
        return this.templateLayoutService.updateTemplateLayout(id, templateLayout);
    }

    @ApiOperation({ summary: 'Delete template layout' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Delete template layout',
    })
    @Delete(':id')
    async deleteTemplateLayout(@Param('id') id: string) {
        return this.templateLayoutService.deleteTemplateLayout(id);
    }

}
