import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';


export class GetUserCountDto {

    @ApiPropertyOptional({
        description: 'Filter for trashed customers',
        example: false,
        type: Boolean,
    })
    @IsOptional()
    isTrashed?: boolean;

}
