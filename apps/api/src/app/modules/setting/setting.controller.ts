
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingDTO } from './dto/setting.dto';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';
import { CrudController } from '@api/app/core/crud';

@ApiTags('Setting')
@Controller("setting")
@UseGuards(AuthGuard('jwt'))
export class SettingController extends CrudController(SettingDTO)<Setting> {
  constructor(private settingService: SettingService) {
    super(settingService);
  }

  @ApiOperation({ summary: 'Update Setting' })
  @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed',
  })
  @ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('setting')
  async updateSetting(
      @Body() request?: any,
  ) {
      return this.settingService.updateSetting(request);
  }


}
