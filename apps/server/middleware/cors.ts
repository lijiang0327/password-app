import { Context } from 'koa';
import koaCors from '@koa/cors';

let allowOrigins: string[] = [];

const verifyOrigin = (ctx: Context) => {
  const origin = ctx.headers.origin;

  if (origin && allowOrigins.includes(origin)) {
    return origin;
  }

  return '';
}

export const cors = () => {
  const envOrigin = process.env.CORS_ALLOW_ORIGIN ?? ''
  allowOrigins = envOrigin.split(';');

  return koaCors({
    origin: verifyOrigin,
    allowMethods: ['POST', 'GET', 'OPTIONS']
  });
}