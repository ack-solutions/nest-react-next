import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { BaseDTO } from './base.dto';


export class SuccessDTO extends BaseDTO {

    @ApiProperty()
    @IsString()
    message: string;

}
