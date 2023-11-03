'use client'

import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Image from 'next/image';
import toast, {Toaster} from 'react-hot-toast';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import {useSignin} from 'hooks';
import {AddressDialog} from 'components';

const Login = () => {
  const [addressDialogVisible, setAddressDialogVisible] = useState(false);

  const router = useRouter();
  const {
    signin
  } = useSignin();

  const onLoginWithPolkadotClickHandler = async () => {
    setAddressDialogVisible(true);
  }

  const onSigninFail = async () => {
    localStorage.setItem('password-app-token', '');
  }

  const onConfirmHandler = async (account: InjectedAccountWithMeta) => {
    const result = await signin(account);

    if (result.errMsg) {
      toast.error(result.errMsg);
      onSigninFail();
      return;
    }

    if (result.token) {
      toast.success('login success');
      localStorage.setItem('password-app-token', result.token);
      setAddressDialogVisible(false);
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    onSigninFail();
  }

  return (
    <div className="h-screen max-w-md bg-zinc-300 mx-auto flex flex-col gap-16 items-center justify-center">
      <h2 className="text-2xl text-black font-medium" data-testid="page-title">Welcome to Password-APP</h2>
      <div 
        className="hover:bg-gray-50 transition cursor-pointer flex items-center gap-4 px-10 py-4 bg-white rounded-lg shadow-md shadow-gray-400"
        onClick={onLoginWithPolkadotClickHandler}
      >
        <Image src="images/polkadot.svg" alt="polkadot" width={28} height={28}  />
        <span data-testid="login-with-polkadot" className="text-lg">Login With Polkadot</span>
      </div>
      <Toaster />
      <AddressDialog 
        visible={addressDialogVisible}
        onConfirm={onConfirmHandler}
        onClose={() => setAddressDialogVisible(false)}
      />
    </div>
  )
}

export default Login;
