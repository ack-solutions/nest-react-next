import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';


export class RangeDto {

    @ApiProperty({
        type: String,
        format: 'date-time',
    })
    @IsDateString()
    @IsNotEmpty()
    start: string;

    @ApiProperty({
        type: String,
        format: 'date-time',
    })
    @IsDateString()
    @IsNotEmpty()
    end: string;

}
