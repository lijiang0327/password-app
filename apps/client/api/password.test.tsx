import {renderHook, waitFor} from '@testing-library/react';
import React from 'react';
import {QueryClientProvider, QueryClient} from 'react-query';

import {useGetPassword} from './password';
import {request} from '../utils';

jest.mock('../utils');

const queryClient = new QueryClient();

describe('password', () => {
  it('should return isLoading and getPassword function', async () => {
    const wrapper = ({children}) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }
    const {result} = renderHook(useGetPassword, {wrapper});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(undefined);
    expect(result.current.getPassword).toBeDefined();
    expect(typeof result.current.getPassword === 'function').toBe(true);
  })

  it('should get response correctly', async () => {
    const wrapper = ({children}) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }

    const mockData = {
      data: {
        password: 'xxxxxxfkladjfl;adf'
      }
    };

    (request.get as jest.Mock).mockResolvedValue(mockData);

    const {result} = renderHook(useGetPassword, {wrapper});

    await waitFor(async () => {
      await result.current.getPassword();

      await new Promise((resolve) => {
        setTimeout(() => {
          expect(result.current.data).toMatchObject(mockData.data);

          resolve(null);
        }, 500)
      })
    })
  })

  it('should get the error status if api response error', async () => {
    const wrapper = ({children}) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }

    const mockData = {
      response: {
        status: 401
      }
    };

    (request.get as jest.Mock).mockRejectedValue(mockData);

    const {result} = renderHook(useGetPassword, {wrapper});

    await waitFor(async () => {
      await result.current.getPassword();

      expect(result.current.data).toMatchObject({status: 401});
    })
  })
});
