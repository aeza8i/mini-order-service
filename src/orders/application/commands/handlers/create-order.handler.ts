import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrder } from '../impl';
import { Inject, Logger } from '@nestjs/common';
import { Order } from '../../../domain/models/order.model';
import { IOrdersRepository } from '../../orders.repository.interface';

@CommandHandler(CreateOrder)
export class CreateOrderHandler implements ICommandHandler<CreateOrder> {
  protected readonly logger = new Logger(CreateOrderHandler.name);

  constructor(
    protected readonly publisher: EventPublisher,
    @Inject('IOrdersRepository') protected readonly repository: IOrdersRepository,
  ) {}

  async execute(command: CreateOrder) {
    this.logger.verbose(`${CreateOrderHandler.name} executed.`);
    const { data, meta } = command;
    try {
      const order: Order = this.publisher.mergeObjectContext(
        new Order(), // empty model
      );
      order.create(data, meta);
      order.commit();
    } catch (err) {
      throw err;
    }
  }
}
