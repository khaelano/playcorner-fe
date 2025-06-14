export type LoginBody = {
  identifier: string;
  password: string;
};

export type ReservationBody = {
  tvId: number;
  borrowerId: string;
  timeSlot: string;
};

export type RequestStatus = "onprogress" | "success" | "failed" | "inactive";

export type ResponseBody<T> = {
  code: number;
  status: string;
  data: T;
};

export type ApiError = {
  errorMsg: string;
};

export type User = {
  id: number; // NIM
  name: string;
  faculty: string;
  major: string; // jurusan
  creditScore: number;
  year: number;
  email: string;
  profilePictUrl: string;
};

export type TokenCarrier = {
  authToken: string;
  userId: number;
  expDate: string;
};

export type TV = {
  id: number;
  timeSlots: {
    startTime: string;
    endTime: string;
    availability: "available" | "unavailable" | "unknown";
  }[];
  consoleType: string;
};

export type PagedData<T> = {
  offset: number;
  limit: number;
  total: number;
  data: T[];
};

export type History = {
  id: number;
  tvId: number;
  consoleType: string;
  reservationDateTime: string; // format ISO 8601
  tvPictUrl: string;
};

export type GameCornerInfo = {
  tvIdList: number[];
  gameList: {
    id: number;
    title: string;
    coverPictUrl: string;
  }[];
};
