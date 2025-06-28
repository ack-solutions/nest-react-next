import { IRenderTemplateInput, ITemplate, ITemplateGetInput } from '@libs/types';

import { Service } from './service';


export class TemplateService extends Service {

    protected apiPath = 'template';

    getAll(request: ITemplateGetInput) {
        return this.instanceApi.get<ITemplate[]>(`${this.apiPath}`, { params: request }).then(({ data }) => data);
    }

    get(id: string) {
        return this.instanceApi.get<ITemplate>(`${this.apiPath}/${id}`).then(({ data }) => data);
    }

    create(template: Partial<ITemplate>) {
        return this.instanceApi.post<ITemplate>(`${this.apiPath}`, template).then(({ data }) => data);
    }

    update(id: string, template: Partial<ITemplate>) {
        return this.instanceApi.put<ITemplate>(`${this.apiPath}/${id}`, template).then(({ data }) => data);
    }

    delete(id: string) {
        return this.instanceApi.delete<ITemplate>(`${this.apiPath}/${id}`).then(({ data }) => data);
    }

    render(template: IRenderTemplateInput) {
        return this.instanceApi.post<string>(`${this.apiPath}/render`, template).then(({ data }) => data);
    }


    getQueryKey(method?: 'get-all' | 'get-one' | 'get-many' | string) {
        return [this.apiPath, method].filter(Boolean).join('/');
    }

}
