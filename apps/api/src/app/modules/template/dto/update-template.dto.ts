import { CreateTemplateDto as NestCreateTemplateDto } from '@ackplus/nest-dynamic-templates';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';


export class UpdateTemplateDto extends NestCreateTemplateDto {

    @ApiProperty({
        description: 'The id of the organization',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    scopeId: string;

}
