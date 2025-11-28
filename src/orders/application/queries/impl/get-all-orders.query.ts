import { IQuery } from '@nestjs/cqrs';
import { GetOrdersFilterDto } from '../../../domain/dtos';
import { IMetadata } from '../../../domain/interfaces';

export class GetAllOrders implements IQuery {
  constructor(
    public readonly data: GetOrdersFilterDto,
    public readonly meta: IMetadata,
  ) { }
}
