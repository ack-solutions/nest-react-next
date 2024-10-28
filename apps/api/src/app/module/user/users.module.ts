import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,

    ]),
    
  ],
  providers: [
    UserService,
    ConfigModule
  ],
  controllers: [UsersController],
  exports: [
    UserService
  ]
})
export class UsersModule { }
