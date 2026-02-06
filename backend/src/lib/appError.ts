export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    // call the parent error class constructor
    super(message);

    // assign http status code
    this.statusCode = statusCode;

    // mark this error as safe and expected
    this.isOperational = true;

    // Remove constructor from stack trace for cleaner debugging
    Error.captureStackTrace(this, this.constructor);
  }
}
