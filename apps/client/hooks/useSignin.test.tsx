import {renderHook, waitFor} from '@testing-library/react';

import {useLogin} from '../api';
import {useSign} from "./usePolkadotExtension";
import {useSignin} from './useSignin';

jest.mock('../api', () => ({
  useLogin: jest.fn()
}));
jest.mock('./usePolkadotExtension', () => ({
  useSign: jest.fn()
}));

const mockLoginSuccess = jest.fn(async () => ({token: 'success-abcdef'}));
const mockLoginFail = jest.fn(() => ({response: {status: 401}}));
const mockShouldNotBeCalled = jest.fn(() => {});


describe('useSignin', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render hook correctly', async () => {
    (useLogin as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      login: () => {}
    }))

    const {result} = renderHook(useSignin);

    expect(result.current.isLoading).toEqual(false);
    expect(typeof result.current.signin).toEqual('function');
  });

  it('should get the token', async () => {
    (useLogin as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      login: mockLoginSuccess
    }));
    const mockSignature = {
      address: 'abc',
      message: 'def',
      signature: 'ijk'
    };
    (useSign as jest.Mock).mockImplementation(() => (() => mockSignature));

    const {result} = renderHook(useSignin);

    await waitFor(async () => {
      const {token, errMsg} = await result.current.signin({address: 'abcdef', meta: {name: 'test', source: 'test'}});

      expect(mockLoginSuccess).toBeCalledWith(mockSignature)
      expect(token).toBe('success-abcdef');
      expect(errMsg).toBeUndefined();
    })
  })

  it('should get errMsg if api error', async () => {
    (useLogin as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      login: mockLoginFail
    }));
    const mockSignature = {
      address: 'abc',
      message: 'def',
      signature: 'ijk'
    };
    (useSign as jest.Mock).mockImplementation(() => (() => mockSignature));

    const {result} = renderHook(useSignin);

    await waitFor(async () => {
      const {token, errMsg} = await result.current.signin({address: 'abcdef', meta: {name: 'test', source: 'test'}});

      expect(mockLoginFail).toBeCalledWith(mockSignature)
      expect(token).toBeUndefined();
      expect(errMsg).toBe('login error');
    })
  })

  it('should get errMsg if params is empty', async () => {
    (useLogin as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      login: mockShouldNotBeCalled
    }));
    const mockSignature = {
      address: '',
      message: '',
      signature: 'ijk'
    };
    (useSign as jest.Mock).mockImplementation(() => (() => mockSignature));

    const {result} = renderHook(useSignin);

    await waitFor(async () => {
      const {token, errMsg} = await result.current.signin({address: 'abcdef', meta: {name: 'test', source: 'test'}});

      expect(mockShouldNotBeCalled).toBeCalledTimes(0);
      expect(token).toBeUndefined();
      expect(errMsg).toBe('signature error');
    })
  })
});