import React, { FC, useEffect, useState } from 'react';
import RcDialog from 'rc-dialog';
import 'rc-dialog/assets/index.css'
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import classnames from 'classnames';

import {useAccounts} from '../hooks/usePolkadotExtension';

type AddressDialogProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (address: InjectedAccountWithMeta) => void;
  loading?: boolean;
}

type AddressItemProps = {
  name: string;
  address: string;
  onClick: () => void;
  selected: boolean;
}

const AddressItem: FC<AddressItemProps> = ({name, address, onClick, selected}) => {

  return <div 
    className={classnames('flex gap-4 items-center mt-4 hover:bg-slate-200 py-2 px-4 cursor-pointer', {'bg-slate-300': selected})}
    onClick={onClick}
    >
    <div 
      className="rounded-full bg-orange-400 text-white text-2xl w-10 h-10 flex items-center justify-center"
    >
      {name.charAt(0).toUpperCase()}
    </div>
    <div>
      <div className="text-lg">{name}</div>
      <div className="text-sm text-gray-400">{address}</div>
    </div>
  </div>

}

export const AddressDialog: FC<AddressDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  loading
}) => {

  const {accounts, getAccounts} = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>();

  useEffect(() => {
    if (visible) {
      getAccounts();
    }
  }, [getAccounts, visible])

  const onCloseHandler = () => {
    setSelectedAccount(undefined);
    onClose();
  }

  const onSignClickHandler = () => {
    if (!selectedAccount) {
      return;
    }

    onConfirm(selectedAccount);
    setSelectedAccount(undefined);
  }

  const disabled = loading || !selectedAccount;

  return (
    <RcDialog
      visible={visible}
      onClose={onCloseHandler}
      maskClosable={false}
      destroyOnClose
      footer={
        <div className="flex gap-4 justify-end">
          <div 
            className="cursor-pointer text-gray-600 rounded-lg px-4 py-2 bg-slate-200"
            onClick={onCloseHandler}
          >Cancel</div>
          <div 
            className={
              classnames(
                'cursor-pointer bg-orange-400 rounded-lg px-4 py-2 text-white', 
                {
                  'bg-orange-200': disabled,
                  'cursor-not-allowed': disabled
                }
              )
            }
            onClick={onSignClickHandler}
          >Signin</div>
        </div>
      }
    >
      {!!accounts?.length && accounts.map((account) => {
        const {meta: {name}, address} = account;

        return <AddressItem 
          key={address} 
          name={name ?? ''} 
          address={address} 
          onClick={() => {
            setSelectedAccount(account)
          }}
          selected={selectedAccount === account}
        />
      })}
    </RcDialog>
  )

}
