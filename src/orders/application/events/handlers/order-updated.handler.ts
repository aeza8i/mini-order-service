import { OrderUpdated } from '../../../domain/events';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { IOrdersRepository } from '../../orders.repository.interface';
import { MockBrokerService } from '../../../../shared';

@EventsHandler(OrderUpdated)
export class OrderUpdatedHandler implements IEventHandler<OrderUpdated> {
  protected readonly logger = new Logger(OrderUpdatedHandler.name);

  constructor(
    @Inject('IOrdersRepository') protected readonly repository: IOrdersRepository,
    protected readonly broker: MockBrokerService
  ) {}

  async handle(event: OrderUpdated) {
    this.logger.verbose(`${OrderUpdated.name} handled.`);
    try {
      const { data, meta } = event;

      await this.repository.update(data);
      await this.repository.appendEvent(data.id, event.eventType, meta.version, data);

      this.broker.publish('events.order.updated', event);
    } catch (err) {
      this.logger.error(err.message);
    }
  }
}
