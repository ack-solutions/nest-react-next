import { ICountResult, IPaginationRequest, IPaginationResult, ISuccessResponse } from '@libs/types';
import { toFormData } from '@libs/utils';
import { pick } from 'lodash';

import { Service } from './service';


export abstract class CRUDService<T> extends Service {

    protected fillable: string[] = [];

    protected hasFileUpload = false;

    getAll(request: any = {}) {
        return this.instanceApi
            .get<T[]>(`${this.apiPath}/all`, {
                params: request,
            })
            .then(({ data }) => {
                return data?.map((file: T) => this.mapResponse(file));
            });
    }

    getMany(request: IPaginationRequest = {}) {
        return this.instanceApi
            .get<IPaginationResult<T>>(`${this.apiPath}`, {
                params: request,
            })
            .then(({ data }) => {
                return {
                    ...data,
                    total: parseInt(data.total + ''),
                    items: data.items?.map((file: T) => this.mapResponse(file)),
                };
            });
    }

    getOne(id: string | number, request = {}) {
        return this.instanceApi
            .get<T>(`${this.apiPath}/${id}`, {
                params: request,
            })
            .then((resp) => {
                return this.mapResponse(resp.data);
            });
    }

    getCounts(request: { filter?: {}, groupByKey?: string | string[] } = {}) {
        return this.instanceApi
            .get<ICountResult>(`${this.apiPath}/get/counts`, {
                params: request,
            })
            .then(({ data }) => {
                return data;
            });
    }

    create(request: Partial<T> = {}) {
        request = this.mapRequest(request);

        if (this.fillable.length > 0) {
            request = pick(request, this.fillable);
        }

        return this.instanceApi
            .post<T>(
                `${this.apiPath}`,
                this.hasFileUpload ? toFormData(request) : request,
            )
            .then((resp) => {
                return this.mapResponse(resp.data);
            });
    }

    update(id: string | number, request: Partial<T> = {}) {
        request = this.mapRequest(request);

        if (this.fillable.length > 0) {
            request = pick(request, this.fillable);
        }

        return this.instanceApi
            .put<T>(
                `${this.apiPath}/${id}`,
                this.hasFileUpload ? toFormData(request) : request,
            )
            .then((resp) => {
                return this.mapResponse(resp.data);
            });
    }

    createMany(bulk: Partial<T>[] = []) {
        return this.instanceApi
            .post<T[]>(`${this.apiPath}/bulk`, { bulk })
            .then((resp) => {
                return resp.data.map((file: T) => this.mapResponse(file));
            });
    }

    updateMany(bulk: Partial<T>[] = []) {
        return this.instanceApi
            .put<T[]>(`${this.apiPath}/bulk`, { bulk })
            .then((resp) => {
                return resp.data.map((file: T) => this.mapResponse(file));
            });
    }

    // count(request?: any) {
    //     return this.instanceApi
    //         .get<T>(`${this.apiPath}/count`, { params: request })
    //         .then(({ data }) => {
    //             return parseInt(data + '');
    //         });
    // }

    delete(id: string | number) {
        return this.instanceApi.delete<ISuccessResponse>(`${this.apiPath}/${id}`).then(({ data }) => data);
    }

    permanentDelete(id: string) {
        return this.instanceApi.delete<ISuccessResponse>(`${this.apiPath}/${id}/trash`).then(({ data }) => data);
    }

    restore(id: string | number) {
        return this.instanceApi.put<ISuccessResponse>(`${this.apiPath}/${id}/restore`).then(({ data }) => data);
    }

    bulkDelete(ids: string[] | number[]) {
        return this.instanceApi.delete<ISuccessResponse>(`${this.apiPath}/delete/bulk`, {
            params: { ids: ids },
        }).then(({ data }) => data);
    }

    bulkRestore(ids: string[] | number[]) {
        return this.instanceApi.put<ISuccessResponse>(`${this.apiPath}/restore/bulk`, {
            ids: ids,
        }).then(({ data }) => data);
    }

    bulkPermanentDelete(ids: string[] | number[]) {
        return this.instanceApi.delete<ISuccessResponse>(`${this.apiPath}/trash/bulk`, {
            params: { ids: ids },
        }).then(({ data }) => data);
    }

    mapResponse(row: T) {
        return row;
    }

    mapRequest(row: Partial<T>) {
        return row;
    }

}
