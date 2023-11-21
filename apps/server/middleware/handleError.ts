import { Context, Next } from 'koa';
import {type ExtendedError, NotFoundError} from '../utils';

export const handleError = async (ctx: Context, next: Next) => {
  try {
    await next();

    const status = ctx.status;

    if (status === 404) {
      throw new NotFoundError('not found');
    } 

  } catch (e) {
    console.error(e);
    const error = e as ExtendedError;

    switch(error.code) {
      case 401:
        ctx.status = 401;
        ctx.body = {
          errorMessage: error.message
        };
        break;
      case 404:
        ctx.status = 404;
        ctx.body = {
          errorMessage: error.message
        };
        break;
      default:
        ctx.status = 500;
        ctx.body = {
          errorMessage: 'unknown error'
        };
    }
  }
}
