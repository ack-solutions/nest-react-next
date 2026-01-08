import { TenantService } from '@ackplus/nest-auth';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { startCase } from 'lodash';

import { IAppConfig } from '../config/app';
import { Seeder } from '@ackplus/nest-seeder';


@Injectable()
export class TenantSeeder implements Seeder {

    constructor(
        private tenantService: TenantService,
        private configService: ConfigService,
    ) { }

    async seed() {
        const defaultTenantName = this.configService.get<IAppConfig>('app').defaultTenantName;

        const tenant = await this.tenantService.getTenantBySlug(defaultTenantName);
        if (!tenant) {
            await this.tenantService.createTenant({
                name: startCase(defaultTenantName),
                domain: defaultTenantName,
            });
        }
    }

    async drop() {
        const tenants = await this.tenantService.getTenants();
        for (const tenant of tenants) {
            await this.tenantService.deleteTenant(tenant.id);
        }
    }

}
