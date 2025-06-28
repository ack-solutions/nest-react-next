import { IChangePhoneNumberInput } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class ChangePhoneInputDTO implements IChangePhoneNumberInput {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ example: '+91 | +1 | +971' })
    @IsString()
    @IsOptional()
    phoneCountryCode?: string;

    @ApiProperty({ example: 'IN | US | AE' })
    @IsString()
    @IsOptional()
    phoneIsoCode?: string;

    // @ApiPropertyOptional()
    // @IsString()
    // @IsOptional()
    // otp?: string;

}
