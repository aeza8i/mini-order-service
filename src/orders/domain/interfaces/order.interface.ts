import { OrderStatusEnum } from '../enums';

export interface IOrder {
  id: string;
  originToken: string;
  destinationToken: string;
  amount: number;
  userId: string;
  status: typeof OrderStatusEnum[number];
  createdAt: Date;
  updatedAt: Date;
}