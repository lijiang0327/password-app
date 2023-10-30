import {renderHook, waitFor} from '@testing-library/react';
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import {web3Accounts, web3Enable, web3FromAddress} from '@polkadot/extension-dapp';

jest.mock('@polkadot/extension-dapp', () => ({
  web3Accounts: jest.fn(),
  web3Enable: jest.fn(),
  web3FromAddress: jest.fn(),
}))

import { useAccounts, useSign } from './usePolkadotExtension';

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

const mockExtensions: InjectedExtension[] = [
  {
    name: 'polkadot-js',
    version: '0.0.1',
    signer: {}
  }
] as InjectedExtension[]

describe('useAccounts', () => {
  beforeEach(() => jest.resetModules());

  it('should render the hook correctly', async () => {
    const {result} = renderHook(useAccounts);

    expect(result.current.accounts).toStrictEqual([]);
    expect(typeof result.current.getAccounts).toEqual('function');
  });

  it('should get accounts correctly', async () => {
    (web3Accounts as jest.Mock).mockImplementation(() => (mockAccountsData));
    (web3Enable as jest.Mock).mockImplementation(() => (mockExtensions));

    const {result} = renderHook(useAccounts);

    await waitFor(async () => {
      await result.current.getAccounts();

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
          expect(result.current.accounts).toStrictEqual(mockAccountsData);
        }, 10);
      })
    })
  });

  it('accounts should be empty array if no extensions', async () => {
    (web3Accounts as jest.Mock).mockImplementation(() => (mockAccountsData));
    (web3Enable as jest.Mock).mockImplementation(() => ([]));

    const {result} = renderHook(useAccounts);

    await waitFor(async () => {
      await result.current.getAccounts();

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
          expect(result.current.accounts).toEqual([]);
        }, 10);
      })
    })
  });

  it('accounts should be empty array if no accounts', async () => {
    (web3Accounts as jest.Mock).mockImplementation(() => ([]));
    (web3Enable as jest.Mock).mockImplementation(() => (mockExtensions));

    const {result} = renderHook(useAccounts);

    await waitFor(async () => {
      await result.current.getAccounts();

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
          expect(result.current.accounts).toEqual([]);
        }, 10);
      })
    })
  });
});

describe('useSign', () => {
  beforeEach(() => jest.resetModules());

  it('should render the hook correctly', () => {
    const {result} = renderHook(useSign);

    expect(typeof result.current).toEqual('function');
  });

  it('should get signature correctly', async () => {
    (web3FromAddress as jest.Mock).mockImplementation(() => ({
      signer: {
        signRaw: () => ({
          signature: 'abcdef'
        })
      }
    }));

    const {result} = renderHook(useSign);

    await waitFor(async () => {
      const signature = await result.current('address', 'abc');

      expect(signature).toStrictEqual({
        address: 'address',
        signature: 'abcdef',
        message: 'abc address'
      });
    })
  })

  it('should get signature correctly with defalt message prefix', async () => {
    (web3FromAddress as jest.Mock).mockImplementation(() => ({
      signer: {
        signRaw: () => ({
          signature: 'abcdef'
        })
      }
    }));

    const {result} = renderHook(useSign);

    await waitFor(async () => {
      const signature = await result.current('address');

      expect(signature).toStrictEqual({
        address: 'address',
        signature: 'abcdef',
        message: 'Sign-in request for address address'
      });
    })
  })

  it('should get empty object if signRaw is null', async () => {
    (web3FromAddress as jest.Mock).mockImplementation(() => ({
      signer: {
        signRaw: null
      }
    }));
    const {result} = renderHook(useSign);

    await waitFor(async () => {
      const signature = await result.current('abcdef');
      
      expect(signature).toEqual({});
    })
  })
})
