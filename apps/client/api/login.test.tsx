import {renderHook, waitFor} from '@testing-library/react';
import React from 'react';
import {QueryClientProvider, QueryClient} from 'react-query';

import {useLogin} from './login';
import {request} from '../utils';

jest.mock('../utils');

const queryClient = new QueryClient();

describe('login', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = ({children}) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
  })

  it('should return isLoading and login function', async () => {
    const {result} = renderHook(useLogin, {wrapper});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login === 'function').toBe(true);
  })

  it('should post params to api and get response', async () => {
    const mockData = {
      data: {
        token: 'xxxxxx'
      }
    };

    (request.post as jest.Mock).mockResolvedValue(mockData);

    const {result} = renderHook(useLogin, {wrapper});

    await waitFor(async () => {
      const data = await result.current.login({address: 'xxx', signature: 'def', message: 'abc'});

      expect(data).toMatchObject(mockData.data);
    })
  })
});
