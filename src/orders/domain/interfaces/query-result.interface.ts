import { IMetadata } from './metadata.interface';

export interface IQueryResult<T> {
  success: boolean;
  data: T;
  meta: IMetadata;
}
