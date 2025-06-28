import { ApiProperty } from '@nestjs/swagger';


export class GetUserCountResponseDTO {

    @ApiProperty({
        description: 'active',
        example: 1,
    })
    active: number;

    @ApiProperty({
        description: 'pending',
        example: 1,
    })
    pending: number;

    @ApiProperty({
        description: 'inactive',
        example: 0,
    })
    inactive: number;

    @ApiProperty({
        description: 'all ',
        example: 2,
    })
    all: number;

}
