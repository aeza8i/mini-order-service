import { Injectable, Logger } from '@nestjs/common';
import { ICommandResult, IMetadata, IOrder, IOrdersService, IQueryResult } from '../domain/interfaces';
import { CreateOrder, UpdateOrder } from './commands/impl';
import { CreateOrderDto, GetOrdersFilterDto, UpdateOrderDto } from '../domain/dtos';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllOrders } from './queries/impl';

@Injectable()
export class OrdersService implements IOrdersService {
  protected readonly logger = new Logger(OrdersService.name);

  constructor(
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus,
  ) {}

  async create(data: CreateOrderDto, meta: IMetadata)
    : Promise<ICommandResult<CreateOrderDto>> {
    await this.commandBus.execute(new CreateOrder(data, meta));
    return { success: true, data, meta };
  }

  async update(data: UpdateOrderDto, meta: IMetadata)
    : Promise<ICommandResult<UpdateOrderDto>> {
    await this.commandBus.execute(new UpdateOrder(data, meta));
    return { success: true, data, meta };
  }

  async getAll(data: GetOrdersFilterDto, meta: IMetadata)
    : Promise<IQueryResult<IOrder[]>> {
    return {
      success: true,
      data: await this.queryBus.execute(new GetAllOrders(data, meta)),
      meta
    };
  }
}
