import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyProcessedException extends HttpException {
  constructor(public msg: string) {
    super(msg, HttpStatus.BAD_REQUEST);
  }
}
