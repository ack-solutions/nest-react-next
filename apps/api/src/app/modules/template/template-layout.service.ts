import {
    TemplateLayoutService as NestTemplateLayoutService,
    RenderContentTemplateLayoutDto,
    TemplateLayoutFilterDto
} from '@ackplus/nest-dynamic-templates';
import { Injectable } from '@nestjs/common';

import { CreateTemplateLayoutDto } from './dto/create-template-layout.dto';
import { UpdateTemplateLayoutDto } from './dto/update-template-layout.dto';
import { RequestContext } from '../../core/request-context/request-context';


@Injectable()
export class TemplateLayoutService {

    private excludeNames = [];

    constructor(
        public readonly nestTemplateLayoutService: NestTemplateLayoutService,
    ) {
        //
    }

    renderTemplateLayout(input: RenderContentTemplateLayoutDto) {
        return this.nestTemplateLayoutService.renderContent(input);
    }


    async getTemplateLayouts(filter: TemplateLayoutFilterDto) {
        const isSuperAdmin = RequestContext.isSuperAdmin();

        if (isSuperAdmin) {
            filter.scope = filter.scopeId ? 'organization' : 'system';
            filter.scopeId = filter.scopeId || null;
        }

        filter.excludeNames = this.excludeNames;

        return this.nestTemplateLayoutService.getTemplateLayouts(filter);
    }

    async getTemplateLayoutById(id: string) {
        return this.nestTemplateLayoutService.getTemplateLayoutById(id);
    }


    async createTemplateLayout(entity: CreateTemplateLayoutDto) {
        if (entity.scopeId) {
            entity.scope = 'organization';
        } else {
            entity.scope = 'system';
            entity.scopeId = null;
        }
        return this.nestTemplateLayoutService.createTemplateLayout(entity);
    }

    async updateTemplateLayout(id: string, entity: UpdateTemplateLayoutDto) {
        const canSystemUpdate = RequestContext.isSuperAdmin();
        if (entity.scopeId) {
            entity.scope = 'organization';
            delete (entity as any).name;
            delete (entity as any).id;
            return this.nestTemplateLayoutService.overwriteSystemTemplateLayout(id, entity);
        }
        entity.scope = 'system';
        entity.scopeId = null;

        return this.nestTemplateLayoutService.updateTemplateLayout(id, entity, canSystemUpdate);
    }

    async deleteTemplateLayout(id: string) {
        const canSystemDelete = RequestContext.isSuperAdmin();
        return this.nestTemplateLayoutService.deleteTemplateLayout(id, canSystemDelete);
    }

}
