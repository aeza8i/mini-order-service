import { IEvent } from '@nestjs/cqrs';
import { IMetadata } from '../interfaces';
import { OrderUpdatedDto } from '../dtos';

export class OrderUpdated implements IEvent {
  readonly eventCategory: string = 'orders';

  readonly eventType: string;

  constructor(
    public readonly data: OrderUpdatedDto,
    public readonly meta: IMetadata,
  ) {
    this.eventType = Object.getPrototypeOf(this).constructor.name;
  }
}
