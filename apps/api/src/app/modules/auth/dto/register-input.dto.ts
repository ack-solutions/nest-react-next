import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { UserDTO } from '../../user/dto/user.dto';


export class RegisterInputDTO extends UserDTO {

    // @ApiProperty()
    // password?: string;

    @ApiProperty()
    otp?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    roles?: any[];

}
