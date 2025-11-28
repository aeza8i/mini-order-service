import { IOrdersRepository } from '../application/orders.repository.interface';
import { Injectable, Logger } from '@nestjs/common';
import { GetOrdersFilterDto, OrderCreatedDto, OrderUpdatedDto } from '../domain/dtos';
import { PrismaService } from '../../shared';
import { IOrder, IOrderEvent } from '../domain/interfaces';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  protected readonly logger = new Logger(OrdersRepository.name);
  constructor(private prisma: PrismaService) {}

  async create(data: OrderCreatedDto): Promise<void> {
    this.logger.verbose(`create executed.`);

    const { requester, ...payload } = data;
    await this.prisma.order.create({
      data: { ...payload, userId: requester.user.id }
    });
  }

  async update(data: OrderUpdatedDto): Promise<void> {
    this.logger.verbose(`update executed.`);

    await this.prisma.order.update({
      where: { id: data.id },
      data: {
        status: data.status
      }
    });
  }

  async getEvents(id: string): Promise<IOrderEvent[]> {
    this.logger.verbose(`getEvents executed.`);

    return this.prisma.orderEvent.findMany({
      where: { aggregateId: id },
      orderBy: { sequence: 'asc' },
    });
  }

  async appendEvent(aggregateId: string, type: string, seq: number, payload: any): Promise<void> {
    this.logger.verbose(`appendEvent executed.`);

    await this.prisma.orderEvent.create({
      data: {
        aggregateId,
        type,
        payload,
        sequence: seq,
      },
    });
  }

  async getAll(filter: GetOrdersFilterDto): Promise<IOrder[]> {
    this.logger.verbose(`getAll executed.`);

    const { userId, status } = filter;
    return this.prisma.order.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(status ? { status } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
