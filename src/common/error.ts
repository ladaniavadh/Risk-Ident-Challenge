export type ErrorType = "ApplicationError" | "MongoError" | "RedisError";
export interface ErrorContent {
  code: string | number;
  error: string;
}
export class CommonError extends Error {
  public readonly code: string | number;

  constructor(errorContent: ErrorContent) {
    super(errorContent.error); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.code = errorContent.code;
  }
}
