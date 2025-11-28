import { OrderStatusEnum } from '../enums';
import { AggregateRoot } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IMetadata } from '../interfaces';
import { CreateOrderDto, UpdateOrderDto } from '../dtos';
import { AlreadyProcessedException, UnauthorizedException } from '../exceptions';
import { isValidRequester } from '../utils';
import { OrderCreated, OrderUpdated } from '../events';
import { v4 as uuidv4 } from 'uuid';

export class Order extends AggregateRoot {
  protected readonly logger = new Logger(Order.name);

  public id: string;

  public originToken: string;

  public destinationToken: string;

  public amount: number;

  public status: typeof OrderStatusEnum[number];

  public requester: {
    user: {
      id: string;
    }
  };

  public version: number;

  public create(data: CreateOrderDto, meta: IMetadata) {
    this.logger.verbose('Order:create');

    if (!isValidRequester({ user: { id: data.userId } }, meta)) {
      throw new UnauthorizedException(
        `unauthorized - requester is not valid by user ${meta.user.id}`,
      );
    }
    this.apply(new OrderCreated({
      id: uuidv4(),
      originToken: data.originToken,
      destinationToken: data.destinationToken,
      amount: data.amount,
      status: 'PENDING',
      requester: { user: { id: data.userId } }
    }, this.getVersionedMeta(meta)));
  }

  public update(data: UpdateOrderDto, meta: IMetadata) {
    this.logger.verbose('Order:update');

    if (this.status !== 'PENDING') {
      throw new AlreadyProcessedException(`order ${data.id} already processed with: ${this.status}`);
    }
    this.apply(new OrderUpdated(data, this.getVersionedMeta(meta)));
  }

  onOrderCreated(event: OrderCreated) {
    this.logger.verbose('Order:onOrderCreated');
    const { data } = event;
    this.id = data.id;
    this.originToken = data.originToken;
    this.destinationToken = data.destinationToken;
    this.amount = data.amount;
    this.status = data.status;
    this.requester = data.requester;
  }

  onOrderUpdated(event: OrderUpdated) {
    this.logger.verbose('Order:onOrderUpdated');
    const { data } = event;
    this.status = data.status;
  }

  getVersionedMeta(meta: IMetadata): IMetadata {
    return { ...meta, version: Math.max(0, this.version || 0) + 1 };
  }
}
