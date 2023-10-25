import Router from '@koa/router';
import { Context } from 'koa';

import {getPassword, signin} from './services';
import { AuthError } from '../utils';

const router = new Router();
export const v1Router = new Router();

router.post('/signin', async (ctx: Context) => {
  ctx.status = 200;

  const token = await signin(ctx);

  if (!token) {
    throw new AuthError('invalid token');
  }

  ctx.body = {token}
});

router.get('/password', async (ctx: Context) => {

  const password: Record<string, unknown> = await getPassword(ctx) ?? {};

  delete(password._id);

  ctx.status = 200;
  ctx.body = {
    ...password
  }
});

v1Router.use('/api/v1', router.routes());
