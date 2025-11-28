import { ICommand } from '@nestjs/cqrs';
import { IMetadata } from '../../../domain/interfaces';
import { CreateOrderDto } from '../../../domain/dtos';

export class CreateOrder implements ICommand {
  constructor(
    public readonly data: CreateOrderDto,
    public readonly meta: IMetadata,
  ) {}
}
