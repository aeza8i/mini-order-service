import { OrderCreated } from '../../../domain/events';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { IOrdersRepository } from '../../orders.repository.interface';
import { MockBrokerService } from '../../../../shared';

@EventsHandler(OrderCreated)
export class OrderCreatedHandler implements IEventHandler<OrderCreated> {
  protected readonly logger = new Logger(OrderCreatedHandler.name);

  constructor(
    @Inject('IOrdersRepository') protected readonly repository: IOrdersRepository,
    protected readonly broker: MockBrokerService
  ) {}

  async handle(event: OrderCreated) {
    this.logger.verbose(`${OrderCreated.name} handled.`);
    try {
      const { data, meta } = event;

      await this.repository.create(data);
      await this.repository.appendEvent(data.id, event.eventType, meta.version, data);

      this.broker.publish('events.order.created', event);
    } catch (err) {
      this.logger.error(err.message);
    }
  }
}
