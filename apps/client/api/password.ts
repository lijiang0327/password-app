import {useMutation} from 'react-query';

import {request} from '../utils';

const getPassword = async () => {
  try {
    const result = await request.get('/v1/password');

    return result.data;
  } catch (error) {
    console.log(error);
    return {
      status: error.response.status
    }
  }
}

export const useGetPassword = () => {

  const {isLoading, data, mutateAsync} = useMutation(getPassword);

  return {
    isLoading,
    data,
    getPassword: mutateAsync,
  }

}
