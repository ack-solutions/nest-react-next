import { NestAuthAuthGuard } from '@ackplus/nest-auth';
import { RenderContentTemplateDto, NestDynamicTemplate } from '@ackplus/nest-dynamic-templates';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateService } from './template.service';
import { SuccessDTO } from '../../core/dto/success.dto';


@ApiTags('Template')
@UseGuards(NestAuthAuthGuard)
@Controller('template')
export class TemplateController {

    constructor(private templateService: TemplateService) { }

    @ApiOperation({ summary: 'Render template' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'Render template',
    })
    @Post('render')
    async renderTemplate(@Body() input: RenderContentTemplateDto) {
        return this.templateService.renderTemplate(input);
    }

    @ApiOperation({ summary: 'Get all templates' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: [NestDynamicTemplate],
        description: 'Get all templates',
    })
    @Get('/')
    async getTemplates(@Query() filter: any) {
        return this.templateService.getTemplates(filter);
    }

    @ApiOperation({ summary: 'Get template by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: NestDynamicTemplate,
        description: 'Get template by id',
    })
    @Get(':id')
    async getTemplate(
        @Param('id') id: string,
    ) {
        return this.templateService.getTemplateById(id);
    }

    @ApiOperation({ summary: 'Create template' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: NestDynamicTemplate,
        description: 'Create template',
    })
    @Post('')
    @Throttle({
        default: {
            limit: 5,
            ttl: 60,
        },
    })
    async createTemplate(@Body() template: CreateTemplateDto) {
        return this.templateService.createTemplate(template);
    }

    @ApiOperation({ summary: 'Update template' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: NestDynamicTemplate,
        description: 'Update template',
    })
    @Put(':id')
    async updateTemplate(@Param('id') id: string, @Body() template: UpdateTemplateDto) {
        return this.templateService.updateTemplate(id, template);
    }

    @ApiOperation({ summary: 'Delete template' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SuccessDTO,
        description: 'Delete template',
    })
    @Delete(':id')
    async deleteTemplate(@Param('id') id: string) {
        return this.templateService.deleteTemplate(id);
    }

}
