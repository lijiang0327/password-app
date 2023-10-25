import { Context, Next } from 'koa';
import {verifyToken, AuthError} from '../utils';

const whiteList = [
  '/api/v1/signin',
]

export const routerGuard = async (ctx: Context, next: Next) => {
  const path = ctx.path;

  if (whiteList.includes(path)) {
    await next();
    return;
  }

  const token = ctx.header.authorization;

  const isValid = await verifyToken(token);

  if (!isValid) {
    throw new AuthError('invalid username or password');
  }

  return await next();
}
