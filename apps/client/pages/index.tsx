'use client'

import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import toast, {Toaster} from 'react-hot-toast';

import {useGetPassword} from '../api';

export default function Page() {
    const {data, getPassword} = useGetPassword();
    const router = useRouter();

    useEffect(() => {
        getPassword();
    }, [getPassword])

    const copyToClipboard = (text: string) => {
        try {
            navigator.clipboard.writeText(text);

            toast.success('Copy succeeded')
        } catch (error) {
            console.log(error);
            toast.error('Copy failed')
        }
    }

    if (data?.status === 401) {

        toast.error('invalid token');

        setTimeout(() => {
            router.push('/login');
        }, 2000)

        return;
    }

    return (
        <div className="h-screen max-w-md bg-zinc-300 mx-auto flex flex-col gap-16 items-center justify-center">
            <div className="cursor-pointer" onClick={() => copyToClipboard(data.password)}>
                <h3 className="mb-4">your password: </h3>
                <h3 className="text-lg">{data?.password ?? 'not found'}</h3>
                <span className="text-sm text-gray-800">Click to copy</span>
            </div>
            <button onClick={() => getPassword()}>刷新</button>
            <Toaster />
        </div>
    )
}
