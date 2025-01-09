import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UsersController } from './users.controller';
import { Role } from '../role/role.entity';


@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    providers: [UserService, ConfigModule],
    controllers: [UsersController],
    exports: [UserService],
})
export class UsersModule { }
