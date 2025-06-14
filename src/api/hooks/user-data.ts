import type { AxiosInstance } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  ResponseBody,
  User,
  ApiError,
  RequestStatus,
  PagedData,
  History,
} from "../schema";

export function useUserData(
  client: AxiosInstance,
  userId: number,
): [User | null, RequestStatus, () => void] {
  const [userData, setUserData] = useState<User | null>(null);
  const [fetchStatus, setFetchStatus] = useState<RequestStatus>("inactive");

  const fetchData = useCallback(() => {
    client
      .get<ResponseBody<User | ApiError>>(`/users/${userId}`)
      .then((res) => {
        setUserData(res.data.data as User);
        setFetchStatus("success");
      })
      .catch(() => setFetchStatus("failed"));
  }, [userId, client]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [userData, fetchStatus, fetchData];
}

export function useHistories(
  client: AxiosInstance,
  userId?: number,
): [History[], RequestStatus, () => void, () => void] {
  const [fetchStatus, setFetchStatus] = useState<RequestStatus>("inactive");
  const [histories, setHistories] = useState<History[]>([]);

  const offset = useRef(0);
  const limit = useRef(10);
  const total = useRef(0);

  const pushHistory = useCallback((newItems: History[]) => {
    setHistories((prev) => [...prev, ...newItems]);
  }, []);

  const fetchData = useCallback(() => {
    if (userId === undefined) return;
    setFetchStatus("onprogress");
    client
      .get<ResponseBody<PagedData<History> | ApiError>>(
        `/users/${userId}/histories?offset=${offset.current}&limit=${limit.current}`,
      )
      .then((res) => {
        setFetchStatus("success");
        const pagedData = res.data.data as PagedData<History>;

        total.current = pagedData.total;

        pushHistory(pagedData.data);
      })
      .catch(() => {
        setFetchStatus("failed");
      });
  }, [client, pushHistory, userId]);

  const fetchNext = useCallback(() => {
    if (fetchStatus !== "success" || total.current <= offset.current) return;

    offset.current = offset.current + limit.current;
    fetchData();
  }, [fetchData, fetchStatus]);

  return [histories, fetchStatus, fetchData, fetchNext];
}

export function useHistory(
  client: AxiosInstance,
  histId: number,
  userId: number,
): [History | null, RequestStatus, () => void] {
  const [fetchStatus, setFetchStatus] = useState<RequestStatus>("inactive");
  const [history, setHistory] = useState<History | null>(null);

  const fetchData = useCallback(() => {
    setFetchStatus("onprogress");
    client
      .get<ResponseBody<History | ApiError>>(
        `/users/${userId}/histories/${histId}`,
      )
      .then((res) => {
        setFetchStatus("success");
        setHistory(res.data.data as History);
      })
      .catch(() => setFetchStatus("failed"));
  }, [client, histId, userId]);

  return [history, fetchStatus, fetchData];
}
