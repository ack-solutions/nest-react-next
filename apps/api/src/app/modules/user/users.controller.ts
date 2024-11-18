import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user';
import { ChangePasswordInput, IUser } from '@libs/types';
import { CrudController } from '../../core/crud';
import { User } from './user.entity';
import { RequestContext } from '@api/app/core/request-context/request-context';
import * as bcrypt from 'bcryptjs';
import { hashPassword } from '@api/app/utils';

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
  
  
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() entity: ChangePasswordInput) {
    const currentUser = RequestContext.currentUser();
    const user = await this.userService.getOne(currentUser.id);
    const userPassword = await this.userService.userRepository
      .createQueryBuilder()
      .where({
        id: currentUser.id,
      })
      .select('"passwordHash"')
      .getRawOne();

    const isMatch = await bcrypt.compare(
      entity.oldPassword,
      userPassword.passwordHash
    );
    if (isMatch) {
      await this.userService.userRepository.update(user.id, {
        passwordHash: hashPassword(entity.password)
      });
    } else {
      throw new BadRequestException('Old password is wrong');
    }
    return true;
  }

}
