import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MockBrokerService {
  private logger = new Logger(MockBrokerService.name);
  public events: Array<any> = [];


  publish(event: string, payload: any) {
    const obj = { event, payload, timestamp: new Date().toISOString() };
    this.events.push(obj);
    this.logger.log(`Published ${event} ${JSON.stringify(payload)}`);
  }
}