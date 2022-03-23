import { CustomError } from './custom-error';

export class ForbiddenRequestError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Unauthorized request');

    Object.setPrototypeOf(this, ForbiddenRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Unauthorized request' }];
  }
}
