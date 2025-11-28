import { DynamicModule, Module } from '@nestjs/common';
import { OrdersController } from './interface/orders.controller';
import { OrdersService } from './application/orders.service';
import { OrdersRepository } from './infrastructure/orders.repository';
import { OrderFactory } from './application/order.factory';
import { CommandHandlers } from './application/commands/handlers';
import { EventHandlers } from './application/events/handlers';
import { QueryHandlers } from './application/queries/handlers';
import { Sagas } from './application/sagas';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    OrdersController,
    { provide: 'IOrdersService', useClass: OrdersService },
    { provide: 'IOrdersRepository', useClass: OrdersRepository },
    { provide: 'IOrderFactory', useClass: OrderFactory },

    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    ...Sagas,
  ],
})
export class OrdersModule {
  static registerAsync(options: any): DynamicModule {
    return {
      module: OrdersModule,
      imports: options.imports,
      providers: [{
        provide: 'ORDERS_CONFIG',
        useFactory: options.useFactory,
        inject: options.inject || [],
      }],
    };
  }
}
