import { Context } from 'koa'
import {randomUUID} from 'crypto';

export const signin = async (ctx: Context) => {
  const str = randomUUID();
  const d = ctx.db.collection('secret').insertOne({password: str})

  return 'signin'
}
