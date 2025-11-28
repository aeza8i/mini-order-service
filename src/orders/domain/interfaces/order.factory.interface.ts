import { Order } from '../models/order.model';
import { IOrderEvent } from './order.event.interface';

export interface IOrderFactory {
  reconstitute(events: IOrderEvent[]): Order;
}