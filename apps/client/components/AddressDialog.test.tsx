import React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import '@testing-library/jest-dom';

import {useAccounts} from '../hooks/usePolkadotExtension';
import {AddressDialog} from './AddressDialog';

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

const mockGetAccounts = jest.fn();

jest.mock('../hooks/usePolkadotExtension', () => ({
  useAccounts: jest.fn()
}))

describe('AddressDialog', () => {
  beforeAll(() => {
    jest.resetModules();
  })

  it('should render correctly', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    (useAccounts as jest.Mock).mockImplementation(() => {
      return {
        accounts: mockAccountsData,
        getAccounts: mockGetAccounts
      }
    })

    await render(<AddressDialog
      visible={true}
      onClose={onClose}
      onConfirm={onConfirm}
    />);

    expect((await screen.findAllByTestId('address-item')).length).toBe(2);
    expect(screen.getByTestId('signin-button')).toBeInTheDocument();

    const cancelButton = await screen.getByTestId('cancel-button');
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(onClose).toBeCalledTimes(1);
    expect(onConfirm).toBeCalledTimes(0);
  });

  it('should not render the dialog if visible is false', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    
    await render(<AddressDialog
      visible={false}
      onClose={onClose}
      onConfirm={onConfirm}
    />);

    expect((await screen.queryAllByTestId('address-item')).length).toBe(0);
    expect((await screen.queryAllByTestId('signin-button')).length).toBe(0);
  })

  it('onClose should be invoke if click the cancel button', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    (useAccounts as jest.Mock).mockImplementation(() => {
      return {
        accounts: mockAccountsData,
        getAccounts: mockGetAccounts
      }
    })

    await render(<AddressDialog
      visible={true}
      onClose={onClose}
      onConfirm={onConfirm}
    />);
    const signinButton = await screen.getByTestId('signin-button');
    const addressItems = await screen.findAllByTestId('address-item');

    expect(addressItems.length).toBe(2);
    expect(signinButton).toBeInTheDocument();

    await userEvent.click(addressItems.at(0)!);
    await userEvent.click(signinButton);

    expect(onClose).toBeCalledTimes(0);
    expect(onConfirm).toBeCalledTimes(1);
  })
})