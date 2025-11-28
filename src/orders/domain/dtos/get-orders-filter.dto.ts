import { IsIn, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum } from '../enums';
import { Transform } from 'class-transformer';

export class GetOrdersFilterDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value))
  @IsIn(OrderStatusEnum)
  status?: typeof OrderStatusEnum[number];
}