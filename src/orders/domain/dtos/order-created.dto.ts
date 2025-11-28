import { OrderStatusEnum } from '../enums';

export class OrderCreatedDto {
  id: string;
  originToken: string;
  destinationToken: string;
  amount: number;
  status: typeof OrderStatusEnum[number];
  requester: { user: { id: string } };
}
