import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';

import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
    imports: [NestAuthModule],
    providers: [PermissionService],
    controllers: [PermissionController],
    exports: [PermissionService],
})
export class PermissionModule { }
