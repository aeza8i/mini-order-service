import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { OrderStatusEnum } from '../enums';

export class UpdateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CANCELED', 'EXECUTED'])
  status: typeof OrderStatusEnum[number];
}