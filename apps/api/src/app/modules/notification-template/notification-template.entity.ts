import { BaseEntity } from '@api/app/core/typeorm/base.entity';
import { generateSlug } from '@api/app/utils/str-to-slug';
import { INotificationTemplate } from '@libs/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';


@Entity()
export class NotificationTemplate extends BaseEntity implements INotificationTemplate {

  @ApiProperty()
  @IsString()
  @Column({
      length: 191,
      nullable: true,
  })
      title?: string;

  @ApiProperty()
  @IsString()
  @Column({
      nullable: true,
      length: 1000,
  })
      emailSubject?: string;

  @ApiProperty()
  @IsString()
  @Column('text', { nullable: true })
      emailBody?: string;

  @ApiProperty({ type: String })
  @IsString()
  @Column({
      length: 255,
      nullable: true,
  })
      slug?: string;

  @ApiProperty()
  @IsString()
  @Column({ nullable: true })
      event?: string;

  @BeforeInsert()
  async createSlug() {
      this.slug = await generateSlug(NotificationTemplate, this.title, this.id);
  }

  @BeforeUpdate()
  async updateSlug() {
      this.slug = await generateSlug(NotificationTemplate, this.title, this.id);
  }

}
