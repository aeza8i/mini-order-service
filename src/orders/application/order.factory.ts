import { IMetadata, IOrderEvent, IOrderFactory } from '../domain/interfaces';
import { Order } from '../domain/models/order.model';
import { Injectable } from '@nestjs/common';
import { OrderCreated, OrderUpdated } from '../domain/events';

export const EventTransformers = {
  [OrderCreated.name]: (payload: any, meta: IMetadata) => new OrderCreated(payload, meta),
  [OrderUpdated.name]: (payload: any, meta: IMetadata) => new OrderUpdated(payload, meta),
};

@Injectable()
export class OrderFactory implements IOrderFactory {
  reconstitute(events: IOrderEvent[]): Order {
    const aggregate = new Order();

    for (const event of events) {
      const factory = EventTransformers[event.type];

      if (!factory) continue;

      aggregate.apply(factory(event.payload, null), true);
      aggregate.version = event.sequence;
    }

    return aggregate;
  }
}
