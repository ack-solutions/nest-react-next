import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UsersController } from './users.controller';


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        NestAuthModule,
        ConfigModule,
    ],
    providers: [UserService],
    controllers: [UsersController],
    exports: [UserService],
})
export class UsersModule { }
