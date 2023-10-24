export class AuthError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
  }

  code = 401;
}

export class NotFoundError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
  }

  code = 404;
}

export type ExtendedError = AuthError | NotFoundError;
