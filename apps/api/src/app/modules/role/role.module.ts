import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';


@Module({
    imports: [NestAuthModule],
    providers: [RoleService],
    controllers: [RoleController],
    exports: [RoleService],
})
export class RoleModule { }
