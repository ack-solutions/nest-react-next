import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';


@Module({
    imports: [NestAuthModule, ConfigModule],
    providers: [RoleService],
    controllers: [RoleController],
    exports: [RoleService],
})
export class RoleModule { }
