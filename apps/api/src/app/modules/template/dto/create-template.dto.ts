import { CreateTemplateDto as NestCreateTemplateDto } from '@ackplus/nest-dynamic-templates/src/lib/dto/create-template.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';


export class CreateTemplateDto extends NestCreateTemplateDto {

    @ApiProperty({
        description: 'The id of the organization',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    scopeId: string;

}
