import {
    ICreatePermissionInput,
    IPermission,
    IUpdatePermissionInput,
} from '@libs/types';

import { Service } from './service';

export class PermissionService extends Service {
    protected apiPath = 'permission';

    async getPermissions(params?: {
        search?: string;
        category?: string;
        guard?: string;
        limit?: number;
    }): Promise<{ items: IPermission[]; total: number }> {
        const response = await this.instanceApi.get<{
            items: IPermission[];
            total: number;
        }>(this.apiPath, { params });
        return response.data;
    }

    async getPermissionById(id: string): Promise<IPermission> {
        const response = await this.instanceApi.get<IPermission>(
            `${this.apiPath}/by-id/${id}`,
        );
        return response.data;
    }

    async getPermissionsByGuard(guard: string): Promise<IPermission[]> {
        const response = await this.instanceApi.get<IPermission[]>(
            `${this.apiPath}/guard/${guard}`,
        );
        return response.data;
    }

    async getCategories(): Promise<string[]> {
        const response = await this.instanceApi.get<string[]>(
            `${this.apiPath}/categories`,
        );
        return response.data;
    }

    async getGuards(): Promise<string[]> {
        const response = await this.instanceApi.get<string[]>(
            `${this.apiPath}/guards`,
        );
        return response.data;
    }

    async searchPermissions(
        query: string,
        guard?: string,
        limit?: number,
    ): Promise<IPermission[]> {
        const response = await this.instanceApi.get<IPermission[]>(
            `${this.apiPath}/search`,
            { params: { query, guard, limit } },
        );
        return response.data;
    }

    async createPermission(data: ICreatePermissionInput): Promise<IPermission> {
        const response = await this.instanceApi.post<IPermission>(
            this.apiPath,
            data,
        );
        return response.data;
    }

    async createPermissions(
        permissions: ICreatePermissionInput[],
    ): Promise<IPermission[]> {
        const response = await this.instanceApi.post<IPermission[]>(
            `${this.apiPath}/bulk`,
            permissions,
        );
        return response.data;
    }

    async updatePermission(
        id: string,
        data: IUpdatePermissionInput,
    ): Promise<IPermission> {
        const response = await this.instanceApi.put<IPermission>(
            `${this.apiPath}/${id}`,
            data,
        );
        return response.data;
    }

    async deletePermission(id: string): Promise<void> {
        await this.instanceApi.delete(`${this.apiPath}/${id}`);
    }
}
