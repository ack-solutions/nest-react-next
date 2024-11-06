
import { pick } from 'lodash';
import { Service } from './service';
import { instanceApi, toFormData } from '@mlm/utils';
import { IPaginationRequest } from '@mlm/types';

export abstract class CRUDService<T> extends Service {
  protected abstract apiPath: string;
  protected fillable: string[] = [];
  protected hasFileUpload: boolean = false;

  getMany(request: IPaginationRequest = {}) {
    return instanceApi
      .get(`${this.apiPath}`, {
        params: request,
      })
      .then(({ data }) => {
        return {
          ...data,
          items: data.items?.map((file: T) => this.mapResponse(file)),
        };
      });
  }

  getOne(id: string | number, request = {}) {
    return instanceApi
      .get<T>(`${this.apiPath}/${id}`, {
        params: request,
      })
      .then((resp) => {
        return this.mapResponse(resp.data);
      });
  }

  create(request: Partial<T> = {}) {
    request = this.mapRequest(request);

    if (this.fillable.length > 0) {
      request = pick(request, this.fillable);
    }

    return instanceApi
      .post<T>(
        `${this.apiPath}`,
        this.hasFileUpload ? toFormData(request) : request
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

    return instanceApi
      .put<T>(
        `${this.apiPath}/${id}`,
        this.hasFileUpload ? toFormData(request) : request
      )
      .then((resp) => {
        return this.mapResponse(resp.data);
      });
  }

  count(request?: any) {
    return instanceApi
      .get<T>(`${this.apiPath}/count`, { params: request })
      .then(({ data }) => {
        return data;
      });
  }

  delete(id: string | number) {
    return instanceApi.delete<T>(`${this.apiPath}/${id}`);
  }

  trashDelete(id: string) {
    return instanceApi.delete<T>(`${this.apiPath}/${id}/trash`)
  }

  restoreTrashed(id: string | number) {
    return instanceApi.put<T>(`${this.apiPath}/${id}/restore`)
  }

  bulkDelete(ids: string[] | number[]) {
    return instanceApi.delete<T>(`${this.apiPath}`, {
      params: { ids: ids?.join(',') },
    });
  }

  mapResponse(row: T) {
    return row;
  }

  mapRequest(row: Partial<T>) {
    return row;
  }


  getQueryKey(method?: 'get-all' | 'get' | 'create' | 'update' | 'delete' | string) {
    return [this.apiPath, method].filter(Boolean).join('/')
  }
}
