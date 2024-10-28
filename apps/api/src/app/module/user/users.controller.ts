import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user';
import { IUser } from '@mlm/types';
import { CrudController } from '@mlm/nest-core';


@ApiTags('User')
@Controller('user')
@UseGuards()
export class UsersController extends CrudController(UserDTO)<IUser> {
  constructor(private userService: UserService) {
    super(userService);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async findCurrentUser(@CurrentUser() user: IUser): Promise<IUser> {
    return this.userService.userRepository.findOne({
      where: {
        id: user?.id,
      },
      relations: [
        'roles',
        'roles.permissions',
      ],
    });
  }

}
