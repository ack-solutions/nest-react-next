
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionController } from './permission.controller';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Permission]),
    ],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule { }
