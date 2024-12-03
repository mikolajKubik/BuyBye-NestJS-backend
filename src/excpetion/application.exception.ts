import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
  constructor(
    type: string,
    title: string,
    status: HttpStatus,
    detail: string,
    instance: string

) {
    super(
      {
        type,
        title,
        status,
        detail,
        instance,
      },
      status
    );
  }
}