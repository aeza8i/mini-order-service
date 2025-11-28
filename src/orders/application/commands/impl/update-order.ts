import { ICommand } from '@nestjs/cqrs';
import { IMetadata } from '../../../domain/interfaces';
import { UpdateOrderDto } from '../../../domain/dtos';

export class UpdateOrder implements ICommand {
  constructor(
    public readonly data: UpdateOrderDto,
    public readonly meta: IMetadata,
  ) {}
}
