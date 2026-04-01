import { IRenderTemplateLayoutInput, ITemplateLayout, ITemplateLayoutGetInput } from '@libs/types';

import { Service } from './service';


export class TemplateLayoutService extends Service {

    protected apiPath = 'template-layout';

    getAll(request: ITemplateLayoutGetInput) {
        return this.instanceApi.get<ITemplateLayout[]>(`${this.apiPath}`, { params: request }).then(({ data }) => data);
    }

    get(id: string) {
        return this.instanceApi.get<ITemplateLayout>(`${this.apiPath}/${id}`).then(({ data }) => data);
    }

    create(templateLayout: Partial<ITemplateLayout>) {
        return this.instanceApi.post<ITemplateLayout>(`${this.apiPath}`, templateLayout).then(({ data }) => data);
    }

    update(id: string, templateLayout: Partial<ITemplateLayout>) {
        return this.instanceApi.put<ITemplateLayout>(`${this.apiPath}/${id}`, templateLayout).then(({ data }) => data);
    }

    delete(id: string) {
        return this.instanceApi.delete<ITemplateLayout>(`${this.apiPath}/${id}`).then(({ data }) => data);
    }

    render(input: IRenderTemplateLayoutInput) {
        return this.instanceApi.post<string>(`${this.apiPath}/render`, input).then(({ data }) => data);
    }


    getQueryKey(method?: 'get-all' | 'get-one' | 'get-many' | string) {
        return [this.apiPath, method].filter(Boolean).join('/');
    }

}
