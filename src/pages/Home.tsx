import { useCallback, useEffect, useState } from "react";

import { client } from "../api/client";
import Carousel from "../components/carousel/Carousel";
import GameSlide from "../components/carousel/GameSlide";
import { useUserData } from "../api/hooks/user-data";
import {
  useGameCornerInfo,
  useReservation,
  useTvInfo,
} from "../api/hooks/tv-data";
import Selector from "../components/buttons/Selector";
import { useGlobalStore } from "../store";
import Button from "../components/buttons/Button";
import ReservationPopup from "../components/popups/ReservationPopup";

const StatusCard = ({
  availableConsole,
  creditScore,
}: {
  availableConsole: string[];
  creditScore: number | undefined;
}) => (
  <div className="self-stretch flex items-center flex-row px-8 py-6 rounded-2xl bg-primary-500 text-neutral-200 justify-between">
    {/* left col */}
    <div className="flex flex-col items-start space-y-1">
      <h5 className="text-base text-left">Tersedia</h5>
      <div className="flex flex-row space-x-2">
        {availableConsole.map((str, i) => (
          <p
            key={i}
            className="text-sm text-center px-3 bg-primary-400 rounded-lg py-0.25"
          >
            {str}
          </p>
        ))}
      </div>
    </div>
    {/* divider */}
    <div className="self-stretch bg-neutral-200 w-0.5 rounded-full" />
    {/* right col */}
    <div className="flex flex-col items-start space-y-0">
      <h5 className="text-base text-left">Skor Kredit</h5>
      <p className="text-base font-bold text-left text-white">
        {creditScore}/100
      </p>
    </div>
  </div>
);

const ReservationDiv = ({ tvIdList }: { tvIdList: number[] }) => {
  const [selectedTvIndex, setSelectedTvIndex] = useState<number | undefined>(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<
    number | undefined
  >(undefined);

  const [displayPopup, setDisplayPopup] = useState<boolean>(false);

  const [reservationReqStatus, createReservations, resetReservationStatus] =
    useReservation(
      client,
      selectedTvIndex !== undefined ? tvIdList[selectedTvIndex] : undefined,
    );
  const [tvInfo, tvInfoFetchStatus, fetchTvInfo] = useTvInfo(
    client,
    selectedTvIndex !== undefined ? tvIdList[selectedTvIndex] : undefined,
  );

  useEffect(() => {
    if (reservationReqStatus === "success") {
      setDisplayPopup(true);
    }
  }, [reservationReqStatus]);

  const closeCallback = useCallback(() => {
    setDisplayPopup(false);
    setSelectedTimeIndex(undefined);
    resetReservationStatus();
    fetchTvInfo();
  }, [fetchTvInfo, resetReservationStatus]);

  const OrderButton = () => (
    <div className="fixed w-screen left-0 bottom-24 p-4">
      <Button className="w-full" onClick={createReservations}>
        <p className="font-bold">Pesan Sekarang</p>
      </Button>
    </div>
  );

  const OrderPopup = () => (
    <ReservationPopup
      reservationStatus={
        reservationReqStatus === "inactive" ||
        reservationReqStatus === "onprogress"
          ? "failed"
          : reservationReqStatus
      }
      closeCallback={closeCallback}
    />
  );

  return (
    <>
      {/* order popup */}
      {displayPopup === true ? <OrderPopup /> : undefined}
      {/* reservation div */}
      <div
        className={`flex flex-col space-y-6 transition-all duration-150 ${selectedTimeIndex !== undefined ? "pb-14" : ""}`}
      >
        {/* tv selector */}
        <div className="space-y-3">
          <h2 className="text-primary-500 font-bold">Device</h2>
          <Selector
            className="flex flex-row space-x-4 overflow-x-scroll scrollbar-hidden -mx-4 px-4"
            onChange={(i, action) => {
              if (action === "selected") {
                setSelectedTvIndex(i);
              } else {
                setSelectedTvIndex(undefined);
              }
              setSelectedTimeIndex(undefined);
            }}
            selectedIndex={selectedTvIndex}
            items={tvIdList.map((id) => (
              <p className="text-nowrap mx-2">{`TV ${id}`}</p>
            ))}
          />
        </div>
        {/* time selector */}
        <div className="space-y-3">
          <h2 className="text-primary-500 font-bold">Waktu yang Tersedia</h2>
          <Selector
            disabled={
              selectedTvIndex === undefined ||
              tvInfoFetchStatus === "onprogress" ||
              reservationReqStatus === "onprogress"
            }
            className="grid grid-cols-2 gap-4 place-content-stretch"
            onChange={(i, action) => {
              if (action === "selected") {
                setSelectedTimeIndex(i);
                return;
              }
              setSelectedTimeIndex(undefined);
            }}
            selectedIndex={selectedTimeIndex}
            items={tvInfo?.timeSlots.map((ts) => (
              <p className="text-center">{`${ts.startTime} - ${ts.endTime}`}</p>
            ))}
          />
        </div>
        {/* order button */}
        {selectedTimeIndex !== undefined ? <OrderButton /> : undefined}
      </div>
    </>
  );
};

export function HomePage() {
  const [availableConsole] = useState<string[]>(["PS5", "Xbox", "PC"]);
  let userId = useGlobalStore((s) => s.userId);

  // untuk slicing
  if (import.meta.env.DEV) {
    userId = 1;
  }

  const [userData] = useUserData(client, userId!);
  const [gcInfo] = useGameCornerInfo(client);

  return (
    <div className="flex flex-col space-y-6 px-4 h-fit">
      {/* sticky header */}
      <div className="sticky top-0 w-full flex flex-col items-center px-6 py-4 bg-white">
        <h1 className="text-3xl font-bold text-center">Game Corner</h1>
      </div>
      {/* profile */}
      <div className="flex flex-col space-y-3 items-center">
        <img
          src={userData?.profilePictUrl}
          className="aspect-square w-28 h-28 rounded-full"
        />
        <p className="text-2xl text-center font-bold">{userData?.name}</p>
        <p className="text-lg text-center text-primary-300">
          {userData?.major}
        </p>
      </div>
      {/* credit score card */}
      <StatusCard
        availableConsole={availableConsole}
        creditScore={userData?.creditScore}
      />
      {/* game list */}
      <div className="-mx-4">
        <Carousel>
          {gcInfo?.gameList.map(({ ...game }) => GameSlide(game))}
        </Carousel>
      </div>
      {/* tv list */}
      <ReservationDiv tvIdList={gcInfo !== null ? gcInfo.tvIdList : []} />
    </div>
  );
}
