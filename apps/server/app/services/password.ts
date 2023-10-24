import { Context } from 'koa';
import {randomInt} from 'crypto';

export const getPassword = async (ctx: Context) => {
  const ids = await ctx.db.collection('secret').distinct('_id');

  const randomIndex = randomInt(ids.length - 1);

  const password = await ctx.db.collection('secret').findOne({_id: ids[randomIndex]});

  return password;
}
