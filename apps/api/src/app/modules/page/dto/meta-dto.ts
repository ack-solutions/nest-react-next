import { IMetaValue } from '@libs/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class MetaDTO {

    @ApiPropertyOptional()
    @IsString()
    pageTitle: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    meta?: IMetaValue[];

}
