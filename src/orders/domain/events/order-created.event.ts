import { IEvent } from '@nestjs/cqrs';
import { IMetadata } from '../interfaces';
import { OrderCreatedDto } from '../dtos';

export class OrderCreated implements IEvent {
  readonly eventCategory: string = 'orders';

  readonly eventType: string;

  constructor(
    public readonly data: OrderCreatedDto,
    public readonly meta: IMetadata,
  ) {
    this.eventType = Object.getPrototypeOf(this).constructor.name;
  }
}
