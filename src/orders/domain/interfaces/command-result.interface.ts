import { IMetadata } from './metadata.interface';

export interface ICommandResult<T> {
  success: boolean;
  data: T;
  meta: IMetadata;
}
