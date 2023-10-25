import {Context} from 'koa'
import {randomUUID} from 'crypto';
const {cryptoWaitReady, decodeAddress, signatureVerify} = require('@polkadot/util-crypto');
const {u8aToHex} = require('@polkadot/util');

import {AuthError, signToken, setSession} from '../../utils';

const isValidSignature = (signedMessage: string, signature: string, address: string) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
}

export const signin = async (ctx: Context) => {
  const body = ctx.request.body as {message: string, signature: string, address: string};

  await cryptoWaitReady();

  const isValid = isValidSignature(body.message, body.signature, body.address);

  if (!isValid) {
    throw new AuthError('invalid signature');
  }

  const uuid = randomUUID();

  const token = signToken({uuid});

  setSession(uuid, body.address);

  return token;
}
