import type { AxiosInstance } from "axios";
import { useCallback, useEffect, useState } from "react";

import type {
  ResponseBody,
  TV,
  ApiError,
  GameCornerInfo,
  RequestStatus,
} from "../schema";

export function useTvInfo(
  client: AxiosInstance,
  tvId?: number,
): [TV | null, RequestStatus, () => void] {
  const [tvInfo, setTvInfo] = useState<TV | null>(null);
  const [fetchStatus, setFetchStatus] = useState<RequestStatus>("inactive");

  const fetchData = useCallback(() => {
    if (!tvId) {
      setFetchStatus("inactive");
      setTvInfo(null);
    }
    setFetchStatus("onprogress");
    client
      .get<ResponseBody<TV | ApiError>>(`/tvs/${tvId}/reservations`)
      .then((res) => {
        setTvInfo(res.data.data as TV);
        setFetchStatus("success");
      })
      .catch(() => setFetchStatus("failed"));
  }, [client, tvId]);

  useEffect(() => {
    if (tvId) {
      fetchData();
    }
  }, [fetchData, tvId]);

  return [tvInfo, fetchStatus, fetchData];
}

export function useReservation(
  client: AxiosInstance,
  tvId?: number,
): [RequestStatus, () => void, () => void] {
  const [reqStatus, setReqStatus] = useState<RequestStatus>("inactive");

  const createReservation = useCallback(() => {
    if (!tvId) {
      setReqStatus("inactive");
    }
    setReqStatus("onprogress");
    client
      .post<ResponseBody<null | ApiError>>(`/tvs/${tvId}/reservations`)
      .then(() => {
        setReqStatus("success");
      })
      .catch(() => {
        setReqStatus("failed");
      });
  }, [client, tvId]);

  const reset = useCallback(() => {
    setReqStatus("inactive");
  }, []);

  return [reqStatus, createReservation, reset];
}

export function useGameCornerInfo(
  client: AxiosInstance,
): [GameCornerInfo | null, RequestStatus, () => void] {
  const [gcInfo, setGcInfo] = useState<GameCornerInfo | null>(null);
  const [fetchStatus, setFetchStatus] = useState<RequestStatus>("onprogress");

  const fetchData = useCallback(() => {
    client
      .get<ResponseBody<GameCornerInfo | ApiError>>("/tvs")
      .then((res) => {
        setGcInfo(res.data.data as GameCornerInfo);
        setFetchStatus("success");
      })
      .catch(() => setFetchStatus("failed"));
  }, [client]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [gcInfo, fetchStatus, fetchData];
}
