'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import toast, {Toaster} from 'react-hot-toast';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import {useGetPassword} from 'api';
import {AddressDialog} from 'components/AddressDialog';
import {useSignin} from 'hooks'

export default function Page() {
    const {data, getPassword} = useGetPassword();
    const router = useRouter();
    const [addressDialogVisible, setAddressDialogVisible] = useState(false);
    const {isLoading, signin} = useSignin();

    useEffect(() => {
        getPassword();
    }, [getPassword])

    useEffect(() => {
        if (data?.status === 401) {

            toast.error('invalid token');
    
            setTimeout(() => {
                router.push('/login');
            }, 2000)
    
            return;
        }
    }, [data?.status, router])

    const onSignoutClickHandler = () => {
        localStorage.setItem('password-app-token', '');
        router.push('/login');
    }

    const onConfirmHandler = async (account: InjectedAccountWithMeta) => {
        const result = await signin(account);

        if (result.errMsg) {
            toast.error(result.errMsg);
            return;
        }
    
        if (result.token) {
            toast.success('login success');
            localStorage.setItem('password-app-token', result.token);
            setAddressDialogVisible(false);
            getPassword();
        }
    }

    const copyToClipboard = (text: string) => {
        try {
            navigator.clipboard.writeText(text);

            toast.success('Copy succeeded')
        } catch (error) {
            console.log(error);
            toast.error('Copy failed')
        }
    }

    return (
        <div className="relative h-screen max-w-md bg-zinc-300 mx-auto flex flex-col gap-16 items-center justify-center">
            <div className="flex justify-end absolute w-full top-0 px-4 py-4">
                <div 
                    className="cursor-pointer bg-orange-400 rounded-lg px-4 py-2 text-white"
                    onClick={onSignoutClickHandler}
                >Signout</div>
            </div>

            <div className="cursor-pointer" onClick={() => copyToClipboard(data.password)}>
                <h3 className="mb-4">your password: </h3>
                <h3 className="text-lg">{data?.password ?? 'not found'}</h3>
                <span className="text-sm text-gray-800">Click to copy</span>
            </div>
            <button 
                className="cursor-pointer bg-orange-400 rounded-lg px-4 py-2 text-white" 
                onClick={() => setAddressDialogVisible(true)}
            >Switch</button>
            <Toaster />
            <AddressDialog
                visible={addressDialogVisible}
                onClose={() => setAddressDialogVisible(false)}
                onConfirm={onConfirmHandler}
            />
        </div>
    )
}
