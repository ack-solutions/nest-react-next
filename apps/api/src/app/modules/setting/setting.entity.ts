import { BaseEntity } from '@api/app/core/typeorm/base.entity';
import { ISetting, SettingTypeEnum } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';


@Entity()
export class Setting extends BaseEntity implements ISetting {

    @ApiProperty()
    @IsString()
    @Column()
        key?: string;

    @ApiProperty()
    @IsString()
    @Column('text', { nullable: true })
        value?: string;

    @ApiProperty({
        type: SettingTypeEnum,
        enum: SettingTypeEnum,
        example: SettingTypeEnum.PUBLIC,
    })
    @IsEnum(SettingTypeEnum)
    @Column('text', { nullable: true })
    @IsOptional()
        type?: SettingTypeEnum;

}
