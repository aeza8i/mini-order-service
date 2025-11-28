import { OrderStatusEnum } from '../enums';

export class OrderUpdatedDto {
  id: string;
  status: typeof OrderStatusEnum[number];
}
