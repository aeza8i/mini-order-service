import { CreateOrderDto, GetOrdersFilterDto, UpdateOrderDto } from '../dtos';
import { IMetadata } from './metadata.interface';
import { ICommandResult } from './command-result.interface';
import { IOrder } from './order.interface';
import { IQueryResult } from './query-result.interface';

export interface IOrdersService {
  create(data: CreateOrderDto, meta: IMetadata): Promise<ICommandResult<CreateOrderDto>>;
  update(data: UpdateOrderDto, meta: IMetadata): Promise<ICommandResult<UpdateOrderDto>>;
  getAll(data: GetOrdersFilterDto, meta: IMetadata): Promise<IQueryResult<IOrder[]>>;
}
