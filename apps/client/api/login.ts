import {useMutation} from 'react-query';

import {request} from '../utils';

type LoginParams = {
  address: string
  message: string
  signature: string
}

const login = async (params: LoginParams) => {

  const result = await request.post('/v1/signin', {...params});

  return result.data;

}

export const useLogin = () => {

  const {isLoading, mutateAsync} = useMutation(login);

  return {
    isLoading,
    login: mutateAsync
  };

}
