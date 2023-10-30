import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {QueryClientProvider, QueryClient} from 'react-query';

import {useSignin} from '../../hooks/useSignin';
import {useAccounts} from '../../hooks/usePolkadotExtension';

const mockAccountsData: InjectedAccountWithMeta[] = [
  {
    address: 'abcdefghi',
    meta: {
      name: 'abc',
      source: 'abc'
    }
  },
  {
    address: 'xxxxxxxxx',
    meta: {
      name: 'test',
      source: 'test'
    }
  }
];

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('../../hooks/useSignin', () => ({
  useSignin: jest.fn(() => ({
    isLoading: false,
    singin: jest.fn()
  }))
}))
jest.mock('../../hooks/usePolkadotExtension', () => ({
  useAccounts: jest.fn(() => ({
    accounts: [],
    getAccounts: jest.fn()
  }))
}))

import Login from './index';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

const queryClient = new QueryClient();

describe('login page', () => {
  let wrapper;
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    wrapper = ({children}) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
    jest.resetModules();
  })

  it('should render page correctly', async () => {
      await waitFor(async () => {
        await render(<QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>);
  
        const loginButton = screen.getByTestId('login-with-polkadot');
  
        expect(loginButton).toHaveTextContent('Login With Polkadot');
        expect(screen.getByTestId('page-title')).toHaveTextContent('Welcome to Password-APP');
  
        await userEvent.click(loginButton);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      })
  })

  it('should singin success', async () => {
    const mockSignin = jest.fn(() => ({token: 'abcdef'}));

    (useAccounts as jest.Mock).mockImplementation(() => ({
      accounts: mockAccountsData,
      getAccounts: jest.fn()
    }));
    (useSignin as jest.Mock).mockImplementation(() => ({
      signin: mockSignin
    }))

    await render(<QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>);

    await (waitFor(async () => {

      const loginButton = screen.getByTestId('login-with-polkadot');
        
      await userEvent.click(loginButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    
      const signinButton = await screen.getByTestId('signin-button');
      const addressItems = await screen.findAllByTestId('address-item');

      expect(signinButton.className).toContain('cursor-not-allow');
      
      await userEvent.click(addressItems.at(0)!);
      await userEvent.click(signinButton);

      expect(mockSignin).toBeCalled();
      expect(localStorage.getItem('password-app-token')).toBe('abcdef');
    }))
  })

  it('should signin failed if api return errMsg', async () => {
    const mockSignin = jest.fn(() => ({errMsg: 'invalid address'}));

    (useAccounts as jest.Mock).mockImplementation(() => ({
      accounts: mockAccountsData,
      getAccounts: jest.fn()
    }));
    (useSignin as jest.Mock).mockImplementation(() => ({
      signin: mockSignin
    }))

    await render(<QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>);

    await (waitFor(async () => {

      const loginButton = screen.getByTestId('login-with-polkadot');
        
      await userEvent.click(loginButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    
      const signinButton = await screen.getByTestId('signin-button');
      const addressItems = await screen.findAllByTestId('address-item');
      
      await userEvent.click(addressItems.at(0)!);
      await userEvent.click(signinButton);

      expect(mockSignin).toBeCalled();
      expect(localStorage.getItem('password-app-token')).toBe('');
    }))
  })
});
