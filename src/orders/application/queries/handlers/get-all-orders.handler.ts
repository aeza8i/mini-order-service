import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllOrders } from '../impl';
import { Inject, Logger } from '@nestjs/common';
import { IOrdersRepository } from '../../orders.repository.interface';

@QueryHandler(GetAllOrders)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrders> {
  protected readonly logger = new Logger(GetAllOrdersHandler.name);

  constructor(
    @Inject('IOrdersRepository') protected readonly repository: IOrdersRepository,
  ) {}

  async execute(query: GetAllOrders) {
    const { data } = query;
    return this.repository.getAll(data);
  }
}
