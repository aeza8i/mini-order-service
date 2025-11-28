export interface IOrderEvent {
  id: string;
  aggregateId: string;
  type: string;
  payload: any;
  sequence: number;
  createdAt: Date;
}
