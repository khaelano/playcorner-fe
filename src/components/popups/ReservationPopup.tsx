import Button from "../buttons/Button";
import Popup from "./Popup";

import CheckIcon from "../../assets/icons/check.svg?react";
import ErrorIcon from "../../assets/icons/error.svg?react";

type ReservationPopupProps = {
  reservationStatus: "success" | "failed";
  closeCallback: () => void;
};

export default function ReservationPopup({
  reservationStatus,
  closeCallback,
}: ReservationPopupProps) {
  const title =
    reservationStatus === "success" ? "Pemesanan Berhasil!" : "Pemesanan Gagal";
  const message =
    reservationStatus === "success"
      ? "Selamat! anda telah berhasil memesan sesi Game Corner"
      : "";
  const icon =
    reservationStatus === "success" ? (
      <CheckIcon className="text-secondary-500" />
    ) : (
      <ErrorIcon className="text-red-500" />
    );

  return (
    <Popup className="flex flex-col bg-white items-center pt-16 space-y-12">
      {icon}
      <h2 className="text-2xl font-bold text-primary-500">{title}</h2>
      <div className="bg-primary-500 rounded-[3rem] p-12 flex flex-col items-center space-y-12">
        <p className="text-white text-center">{message}</p>
        <Button onClick={closeCallback} className="min-w-48 h-12">
          <p className="text-primary-500">Kembali</p>
        </Button>
      </div>
    </Popup>
  );
}
