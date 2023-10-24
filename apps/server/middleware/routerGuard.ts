import { Context, Next } from 'koa';
import {validSignature, AuthError} from '../utils';

const whiteList = [
  '/api/v1/password',
  '/api/v1/signin',
]

export const routerGuard = async (ctx: Context, next: Next) => {
  const path = ctx.path;

  if (whiteList.includes(path)) {
    await next();
    return;
  }

  const isValid = await validSignature('');

  if (!isValid) {
    throw new AuthError('invalid username or password');
  }

  await next();
}
