import { NestAuthAuthGuard } from '@ackplus/nest-auth';
import { Crud } from '@ackplus/nest-crud';
import { Body, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Setting } from './setting.entity';
import { SettingService } from './setting.service';


@ApiTags('Setting')
@UseGuards(NestAuthAuthGuard)
@Crud({
    entity: Setting,
    name: 'Setting',
    path: 'setting',
})
export class SettingController {

    constructor(private service: SettingService) { }

    @ApiOperation({ summary: 'Update Setting' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
    })
    @Post('update-setting')
    async updateSetting(
        @Body() request?: any,
    ) {
        return this.service.updateSetting(request);
    }

}
