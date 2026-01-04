import {
    TemplateService as NestTemplateService,
    CreateTemplateDto,
    RenderContentTemplateDto,
    TemplateFilterDto
} from '@ackplus/nest-dynamic-templates';
import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../core/request-context/request-context';


@Injectable()
export class TemplateService {

    private excludeNames = [];

    constructor(
        public readonly nestTemplateService: NestTemplateService,
    ) {
        //
    }

    renderTemplate(input: RenderContentTemplateDto) {
        return this.nestTemplateService.renderContent(input);
    }


    async getTemplates(filter: TemplateFilterDto) {
        const isSuperAdmin = RequestContext.isSuperAdmin();

        if (isSuperAdmin) {
            filter.scope = filter.scopeId ? 'organization' : 'system';
            filter.scopeId = filter.scopeId || null;
        }

        filter.excludeNames = this.excludeNames;

        return this.nestTemplateService.getTemplates(filter);
    }

    async getTemplateById(id: string) {
        return this.nestTemplateService.getTemplateById(id);
    }


    async createTemplate(entity: CreateTemplateDto) {
        if (entity.scopeId) {
            entity.scope = 'organization';
        } else {
            entity.scope = 'system';
            entity.scopeId = null;
        }
        return this.nestTemplateService.createTemplate(entity);
    }

    async updateTemplate(id: string, entity: CreateTemplateDto) {
        const canSystemUpdate = RequestContext.isSuperAdmin();
        if (entity.scopeId) {
            entity.scope = 'organization';
            return this.nestTemplateService.overwriteSystemTemplate(id, entity);
        }
        entity.scope = 'system';
        entity.scopeId = null;

        return this.nestTemplateService.updateTemplate(id, entity, canSystemUpdate);
    }

    async deleteTemplate(id: string) {
        const canSystemDelete = RequestContext.isSuperAdmin();
        return this.nestTemplateService.deleteTemplate(id, canSystemDelete);
    }

}
