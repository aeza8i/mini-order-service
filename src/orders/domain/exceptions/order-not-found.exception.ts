import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderNotFoundException extends HttpException {
  constructor(id:string) {
    super(`order ${id} not found`, HttpStatus.NOT_FOUND);
  }
}
