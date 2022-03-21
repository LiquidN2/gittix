interface ErrorType {
  message: string;
  field?: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;

  protected constructor(protected errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ErrorType[];
}
