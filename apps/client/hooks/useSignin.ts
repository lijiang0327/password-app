import {useCallback} from "react"

import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import {useLogin} from '../api';
import {useSign} from "./usePolkadotExtension";

export const useSignin = () => {
  const {login, isLoading} = useLogin();
  const sign = useSign();

  const signin = useCallback(async (account: InjectedAccountWithMeta): Promise<{errMsg?: string, token?: string}> => {
    const {
      signature,
      address,
      message
    } = await sign(account.address);

    if (!signature || !address || !message) {
      return {
        errMsg: 'signature error'
      };
    }
    
    const result = await login({signature, address, message});

    if (result.token) {
      return {
        token: result.token
      }
    }

    return {
      errMsg: 'login error'
    }
  }, [login, sign]) 

  return {
    isLoading,
    signin
  };
}