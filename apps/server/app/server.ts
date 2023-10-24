import Koa from 'koa';
import mongo from 'koa-mongo';
import dotenv from 'dotenv';

import {v1Router} from './router';
import {handleError, routerGuard, cors} from '../middleware';

dotenv.config();

export const start = () => {
  const app = new Koa();

  app.use(handleError);
  app.use(routerGuard);
  app.use(mongo({
    host: process.env.MONGO_HOST ?? 'localhost',
    port: Number(process.env.MONGO_PORT ?? 27017),
    db: process.env.MONGO_DB ?? 'test',
    authSource: 'admin',
    max: 100,
    min: 1,
  }));
  app.use(cors());

  app.use(v1Router.routes());

  app.listen(3001, () => {
    console.info('server is running at port 3001');
  });
}
