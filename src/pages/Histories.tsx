import { useEffect, useRef } from "react";

import { client } from "../api/client";
import { useHistories, useUserData } from "../api/hooks/user-data";
import { useGlobalStore } from "../store";
import type { History } from "../api/schema";

import CardIcon from "../assets/icons/card.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";
import SettingsIcon from "../assets/icons/settings.svg?react";
import { Link } from "wouter";

export function HistoriesPage() {
  const userId = useGlobalStore((s) => s.userId);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [userData] = useUserData(client, userId!);
  const [histories, historyReqStatus, fetchHistory, fetchNextHistory] =
    useHistories(client, userId!);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    console.log(histories);
  }, [histories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && historyReqStatus !== "onprogress") {
          fetchNextHistory();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [fetchNextHistory, historyReqStatus]);

  const HistoryEntry = ({
    key,
    history,
  }: {
    key: number;
    history: History;
  }) => {
    const reservationDate = new Date(history.reservationDateTime);
    const reservationEndDate = new Date(
      reservationDate.getTime() + 60 * 60 * 1000,
    );
    return (
      <Link
        key={key}
        to={`/${history.id}`}
        className="flex flex-row space-x-4 p-4 items-center content-start text-monochromatic-800 rounded-xl bg-monochromatic-100"
      >
        <CardIcon className="size-12" />
        <div className="flex flex-col space-y-0 grow">
          <h3 className="font-bold text-primary-500">{`TV ${history.tvId}`}</h3>
          <p>{history.consoleType}</p>
        </div>
        <div className="flex flex-col space-y-0">
          <p>
            {reservationDate.toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p>
            {`${reservationDate.toLocaleString("en-UK", {
              timeStyle: "short",
            })} - ${reservationEndDate.toLocaleString("en-UK", {
              timeStyle: "short",
            })}`}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <>
      <div className="sticky top-0 flex flex-row p-4 space-x-4 items-center content-start w-full border-b-1 border-monochromatic-600 bg-white">
        <div className="p-4 flex flex-row grow bg-primary-500 items-center h-14 justify-center rounded-xl">
          <p className="text-center text-nowrap text-white font-bold overflow-hidden text-ellipsis w-full">
            {userData?.name}
          </p>
        </div>
        <button className="rounded-xl p-4 border-1 border-monochromatic-600 size-14 grid place-content-center">
          <SearchIcon className="size-6" />
        </button>
        <button className="rounded-xl p-4 border-1 border-monochromatic-600 size-14 grid place-content-center">
          <SettingsIcon className="size-6" />
        </button>
      </div>
      <div className="flex flex-col space-y-4 mx-4">
        {histories.map((h, i) => (
          <HistoryEntry key={i} history={h} />
        ))}
        <div className="w-full h-10" ref={loaderRef} />
      </div>
    </>
  );
}
