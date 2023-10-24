import Router from '@koa/router';
import { Context } from 'koa';

import {getPassword, signin} from './services';

const router = new Router();
export const v1Router = new Router();

router.get('/signin', async (ctx: Context) => {
  ctx.status = 200;

  await signin(ctx);

  ctx.body = {
    data: {
      sign: 'abcdef'
    }
  }
});

router.get('/password', async (ctx: Context) => {

  const password = await getPassword(ctx);

  ctx.status = 200;
  ctx.body = {
    data: {
      ...password,
    }
  }
});

v1Router.use('/api/v1', router.routes());
