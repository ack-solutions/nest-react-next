import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user';
import { IUser } from '@libs/types';
import { CrudController } from '../../core/crud';
import { User } from './user.entity';


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

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(RequestDataTypeInterceptor)
  // @UseInterceptors(
  //   FileInterceptor('photo', {
  //     storage: new FileStorage().storage({
  //       dest: () => {
  //         return join('photo', moment().format('YYYY/MM'));
  //       },
  //       prefix: 'photo',
  //     }),
  //   })
  // )
  @Put('update/profile')
  async updateProfile(
    @Body() entity: any,
    // @UploadedFileStorage() photo
  ): Promise<User> {
    // if (photo?.key) {
    //   entity.photo = photo?.key;
    //   await resizeImage(entity.photo, {
    //     height: 200,
    //   });
    // }
    return this.userService.updateProfile(entity);
  }
  
}
