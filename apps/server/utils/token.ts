import {sign, verify, decode} from 'jsonwebtoken';

import {getSession} from './sessionStore';

const secret = process.env.JWT_SECRET ?? 'test-secret';
const expiresIn = process.env.JWT_EXPIRES_IN ?? '180h';

export const verifyToken = (token?: string) => {
  if (!token) {
    return false;
  }

  const isValid = verify(token, secret);

  if (!isValid) {
    return false;
  }

  const payload = decode(token) as {uuid: string, exp: number};

  if (!getSession(payload?.uuid) || !payload?.exp || payload.exp * 1000 < Date.now()) {
    return false;
  }

  return true;
}

export const signToken = (payload: Record<string, unknown>) => {
  return sign(payload, secret, {expiresIn});
}
