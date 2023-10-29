'use client'

import {useCallback, useState} from 'react';
import type {Web3AccountsOptions, InjectedAccountWithMeta, InjectedExtension} from '@polkadot/extension-inject/types';

type Web3Accounts = (options?: Web3AccountsOptions | undefined) => Promise<InjectedAccountWithMeta[]>
type Web3FormAddress = (address: string) =>  Promise<InjectedExtension>;
type Web3Enable = (originName: string, compatInits?: (() => Promise<boolean>)[]) => Promise<InjectedExtension[]>

let paAccounts: Web3Accounts | null = null, 
    paEnable: Web3Enable | null = null, 
    paFromAddress: Web3FormAddress | null = null;

const importExtensionDapp = async () => {
  if (typeof window !== 'undefined') {
    const {web3Accounts, web3Enable, web3FromAddress} = await import('@polkadot/extension-dapp');
    paAccounts = web3Accounts;
    paEnable = web3Enable;
    paFromAddress = web3FromAddress;
  }
}

(async () => {
  await importExtensionDapp();
})();

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  const getAccounts = useCallback(async () => {
    if (!paEnable || !paAccounts) {
      return;
    };

    await paEnable('password-app');
    const allAccounts = await paAccounts();
    setAccounts(allAccounts);

    return allAccounts;
  }, [])

  return {
    accounts,
    getAccounts
  }
}

export const useSign = () => {
  const sign = useCallback(async (address: string, messagePrefix = 'Sign-in request for address') => {
    if (!paFromAddress) {
      return {};
    }

    try {
      const injector = await paFromAddress(address);
      const message = `${messagePrefix} ${address}`;

      if (!injector.signer.signRaw) {
        return {};
      }

      const signature = await injector.signer.signRaw({address, data: message, type: 'payload'});

      return {
        address,
        message,
        signature: signature.signature
      };
    } catch (error) {
      return {};
    }
  }, []);

  return sign;
}
