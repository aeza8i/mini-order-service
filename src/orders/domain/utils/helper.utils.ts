import { IMetadata } from '../interfaces';

export const isValidRequester = (requester: { user: { id: string } }, meta: IMetadata) => meta
  ?.user.id === requester.user.id