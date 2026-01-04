import { CreateTemplateLayoutDto as NestCreateTemplateLayoutDto } from '@ackplus/nest-dynamic-templates';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';


export class CreateTemplateLayoutDto extends NestCreateTemplateLayoutDto {

    @ApiProperty({
        description: 'The id of the organization',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    scopeId: string;

}
