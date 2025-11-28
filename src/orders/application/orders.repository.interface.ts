import { GetOrdersFilterDto, OrderCreatedDto, OrderUpdatedDto } from '../domain/dtos';
import { IOrder, IOrderEvent } from '../domain/interfaces';

export interface IOrdersRepository {
  create(data: OrderCreatedDto): Promise<void>;

  update(data: OrderUpdatedDto): Promise<void>

  getEvents(id: string): Promise<IOrderEvent[]>;

  appendEvent(aggregateId: string, type: string, seq: number, payload: any): Promise<void>;

  getAll(filter: GetOrdersFilterDto): Promise<IOrder[]>;
}
