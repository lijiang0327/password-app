import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api`,
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('password-app-token');
  config.headers.Authorization = token;

  return config;
});

export const request = instance;
