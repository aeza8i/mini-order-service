import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MockBrokerService, PrismaService } from './shared';

@Global()
@Module({
  imports: [CqrsModule.forRoot(), ConfigModule.forRoot(), OrdersModule],
  providers: [Logger, PrismaService, MockBrokerService],
  exports: [Logger, PrismaService, MockBrokerService],
})
export class AppModule {}
