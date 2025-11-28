import { Body, Controller, Get, Inject, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, GetOrdersFilterDto } from '../domain/dtos';
import { IMetadata, IOrdersService } from '../domain/interfaces';

@ApiTags('orders')
@Controller('/api/v1/orders')
export class OrdersController {
  protected readonly logger = new Logger(OrdersController.name);

  constructor(
    @Inject('IOrdersService') private readonly svc: IOrdersService
  ) {}

  @Post()
  async create(@Body() data: CreateOrderDto) {
    // fake metadata: from headers or anywhere
    const metadata: IMetadata = {
      user: { id: data.userId },
    }
    return this.svc.create(data, metadata);
  }

  @Patch('/:id/execute')
  async execute(@Param('id') id: string) {
    // fake metadata: from headers or anywhere
    const metadata: IMetadata = {
      user: { id: '' },
    }
    return this.svc.update({ id, status: 'EXECUTED' }, metadata);
  }

  @Patch('/:id/cancel')
  async cancel(@Param('id') id: string) {
    // fake metadata: from headers or anywhere
    const metadata: IMetadata = {
      user: { id: '' },
    }
    return this.svc.update({ id, status: 'CANCELED' }, metadata);
  }

  @Get()
  async getAll(@Query() data: GetOrdersFilterDto) {
    // fake metadata: from headers or anywhere
    const metadata: IMetadata = {
      user: { id: '' },
    }
    return this.svc.getAll(data, metadata);
  }
}
