import { useParams } from "wouter";
import { client } from "../api/client";
import { useHistory } from "../api/hooks/user-data";
import { useGlobalStore } from "../store";
import { useEffect } from "react";

export default function HistoryPage() {
  const params = useParams();
  const userId = useGlobalStore((s) => s.userId);
  const histId = parseInt(params.histId ?? "1");
  const [history, , fetchHistory] = useHistory(client, histId, userId!);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const reservationDate = history
    ? new Date(history.reservationDateTime)
    : undefined;
  const reservationEndDate = reservationDate
    ? new Date(reservationDate.getTime() + 60 * 60 * 1000)
    : undefined;

  return (
    <>
      <img src={history?.tvPictUrl} className="aspect-square w-full"></img>
      <div className="px-4 pt-6 pb-4 space-y-4">
        <div>
          <h1 className="font-bold text-4xl">{`TV ${history?.tvId}`}</h1>
          <p className="text-2xl text-monochromatic-800">
            {history?.consoleType}
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Detail Pemesanan</h2>
          <div>
            <h3 className="text-lg font-bold">Tanggal Pemesanan</h3>
            <p>
              {reservationDate?.toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Waktu Pemesanan</h2>
            <p>
              {`${reservationDate?.toLocaleString("en-UK", {
                timeStyle: "short",
              })} - ${reservationEndDate?.toLocaleString("en-UK", {
                timeStyle: "short",
              })}`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
