import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateNested } from 'class-validator';


export class PaginationOptionsDTO {
  @ApiPropertyOptional({
      description: 'Number of items to skip',
      example: 0 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
      skip?: number;

  @ApiPropertyOptional({
      description: 'Maximum number of items to return',
      example: 10 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
      take?: number;
}

export class OrderOptionsDTO {
  @ApiPropertyOptional({
      description: 'Order by field',
      example: 'name' 
  })
  @IsOptional()
      orderBy?: string;

  @ApiPropertyOptional({
      description: 'Order direction',
      example: 'ASC',
      enum: ['ASC', 'DESC'] 
  })
  @IsOptional()
      orderDirection?: 'ASC' | 'DESC';
}

export class FindManyOptionsDTO {
  @ApiPropertyOptional({
      description: 'Pagination options',
      type: PaginationOptionsDTO 
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationOptionsDTO)
      pagination?: PaginationOptionsDTO;

  @ApiPropertyOptional({
      description: 'Ordering options',
      type: OrderOptionsDTO 
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsDTO)
      order?: OrderOptionsDTO;

    // Add more properties here as needed, such as filters
}