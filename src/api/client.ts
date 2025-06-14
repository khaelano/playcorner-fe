import axios, { type AxiosRequestConfig } from "axios";

import { useGlobalStore } from "../store";
import type { ResponseBody, TokenCarrier } from "./schema";

const freshClient = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
});

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = useGlobalStore.getState().authToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalConfig = error.config as AxiosRequestConfig & {
      _retry: boolean | undefined;
      _refresh: boolean | undefined;
    };

    if (
      error.response?.status === 401 &&
      !originalConfig._retry &&
      !originalConfig._refresh
    ) {
      const response = await freshClient
        .post<ResponseBody<TokenCarrier>>("/refresh", null, {
          baseURL: import.meta.env.VITE_API_HOST,
          withCredentials: true,
          _refresh: true,
        } as AxiosRequestConfig & { _refresh: boolean })
        .catch((error) => {
          return Promise.reject(error);
        });

      useGlobalStore.setState({ authToken: response.data.data.authToken });
      originalConfig._retry = true;

      return client(originalConfig);
    }
    return Promise.reject(error);
  },
);
