
import { pick } from 'lodash';
import { Service } from './service';
import { IPaginationRequest } from '@libs/types';
import { toFormData } from '../utils/form';

export abstract class CRUDService<T> extends Service {

  protected abstract apiPath: string;
  protected fillable: string[] = [];

  protected hasFileUpload = false;

  getAll(request: any = {}) {
      return this.instanceApi
          .get(`${this.apiPath}/all`, {
              params: request,
          })
          .then(({ data }) => {
              return data?.map((file: T) => this.mapResponse(file))
          });
  }

  getMany(request: IPaginationRequest = {}) {
      return this.instanceApi
          .get(`${this.apiPath}`, {
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

  create(request: Partial<T> = {}) {
      request = this.mapRequest(request);

      if (this.fillable.length > 0) {
          request = pick(request, this.fillable);
      }

      return this.instanceApi
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

      return this.instanceApi
          .put<T>(
              `${this.apiPath}/${id}`,
              this.hasFileUpload ? toFormData(request) : request
          )
          .then((resp) => {
              return this.mapResponse(resp.data);
          });
  }

  count(request?: any) {
      return this.instanceApi
          .get<T>(`${this.apiPath}/count`, { params: request })
          .then(({ data }) => {
              return parseInt(data + '');
          });
  }

  delete(id: string | number) {
      return this.instanceApi.delete<T>(`${this.apiPath}/${id}`);
  }

  permanentDelete(id: string) {
      return this.instanceApi.delete<T>(`${this.apiPath}/${id}/trash`)
  }

  restore(id: string | number) {
      return this.instanceApi.put<T>(`${this.apiPath}/${id}/restore`)
  }

  bulkDelete(ids: string[] | number[]) {
      return this.instanceApi.delete<T>(`${this.apiPath}/delete/bulk`, {
          params: { ids: ids },
      });
  }

  bulkRestore(ids: string[] | number[]) {
      return this.instanceApi.put<T>(`${this.apiPath}/restore/bulk`, {
          ids: ids
      })
  }

  bulkPermanentDelete(ids: string[] | number[]) {
      return this.instanceApi.delete<T>(`${this.apiPath}/trash/bulk`, {
          params: { ids: ids },
      });
  }

  mapResponse(row: T) {
      return row;
  }

  mapRequest(row: Partial<T>) {
      return row;
  }


  getQueryKey(method?: 'get-all' | 'get-one' | 'create' | 'update' | 'delete' | 'trash-delete' | 'restore' | string) {
      return [this.apiPath, method].filter(Boolean).join('/')
  }
}
