'use client'

import {useRouter} from 'next/router';
import React, { useEffect } from 'react';
import Image from 'next/image';
import toast, {Toaster} from 'react-hot-toast';

import {useLogin} from '../../api';

let paAccounts, paEnable, paFromAddress;

const Login = () => {

  useEffect(() => {
    (async () => {
      const {web3Accounts, web3Enable, web3FromAddress} = await import('@polkadot/extension-dapp');

      paAccounts = web3Accounts;
      paEnable = web3Enable;
      paFromAddress = web3FromAddress;

    })()
  }, []);

  const {isLoading, login} = useLogin();
  const router = useRouter();

  const onClickHandler = async () => {

    try {
      await paEnable('password app');
      const allAccounts = await paAccounts();

      const address = allAccounts[0]?.address;

      if (!address) {
        toast.error('Not found wallet address');
        return;
      }

      const injector = await paFromAddress(address);
      const message = `Sign-in request for address ${address}`;

      const signature = await injector.signer.signRaw({address, data: message});

      const result = await login({
        address,
        message,
        signature: signature.signature
      });

      if (result.token) {
        toast.success('login success');
        sessionStorage.setItem('password-app-token', result.token);
        setTimeout(() => {
          router.push('/');
        }, 2000)
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  return (
    <div className="h-screen max-w-md bg-zinc-300 mx-auto flex flex-col gap-16 items-center justify-center">
      <h2 className="text-2xl text-black font-medium">Welcome to Password-APP</h2>
      <div 
        className="hover:bg-gray-50 transition cursor-pointer flex items-center gap-4 px-10 py-4 bg-white rounded-lg shadow-md shadow-gray-400"
        onClick={onClickHandler}
      >
        <Image src="images/polkadot.svg" alt="polkadot" width={28} height={28}  />
        <span className="text-lg">Login With Polkadot</span>
      </div>
      <Toaster />
    </div>
  )
}

export default Login;
