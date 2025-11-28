import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrder } from '../impl';
import { Inject, Logger } from '@nestjs/common';
import { Order } from '../../../domain/models/order.model';
import { IOrdersRepository } from '../../orders.repository.interface';
import { IOrderFactory } from '../../../domain/interfaces';

@CommandHandler(UpdateOrder)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrder> {
  protected readonly logger = new Logger(UpdateOrderHandler.name);

  constructor(
    protected readonly publisher: EventPublisher,
    @Inject('IOrdersRepository') protected readonly repository: IOrdersRepository,
    @Inject('IOrderFactory') protected readonly factory: IOrderFactory,
  ) {}

  async execute(command: UpdateOrder) {
    this.logger.verbose(`${UpdateOrderHandler.name} executed.`);
    const { data, meta } = command;
    try {
      const order: Order = this.publisher.mergeObjectContext(
        this.factory.reconstitute(
          await this.repository.getEvents(data.id),
        ),
      );
      order.update(data, meta);
      order.commit();
    } catch (err) {
      throw err;
    }
  }
}
