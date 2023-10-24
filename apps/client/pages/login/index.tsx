import React from 'react';
import Image from 'next/image';

const Login = () => {
  return (
    <div className="h-screen max-w-md bg-zinc-300 mx-auto flex flex-col gap-16 items-center justify-center">
      <h2 className="text-2xl text-black font-medium">Welcome to Password-APP</h2>
      <div className="hover:bg-gray-50 transition cursor-pointer flex items-center gap-4 px-10 py-4 bg-white rounded-lg shadow-md shadow-gray-400">
        <Image src="images/polkadot.svg" alt="polkadot" width={28} height={28}  />
        <span className="text-lg">Login With Polkadot</span>
      </div>
    </div>
  )
}

export default Login;
