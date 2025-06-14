import { http, HttpResponse } from "msw";

import {
  type ResponseBody,
  type User,
  type LoginBody,
  type TokenCarrier,
  type TV,
  type GameCornerInfo,
  type ApiError,
  type ReservationBody,
  type History,
  type PagedData,
} from "../schema";

const errorResponse = (code: number) => {
  let status: string;
  let message: string;

  switch (code) {
    case 401:
      status = "UNAUTHORIZED";
      message = "you are not authorized to access this resource";
      break;
    case 404:
      status = "NOT FOUND";
      message = "resource not found";
      break;
    default:
      status = "INTERNAL SERVER ERROR";
      message = "something's wrong";
  }

  const response: ResponseBody<ApiError> = {
    code: code,
    status: status,
    data: {
      errorMsg: message,
    },
  };

  return HttpResponse.json<ResponseBody<ApiError>>(response, { status: code });
};

const successResponse = <T>(data: T) => {
  const response: ResponseBody<T> = {
    code: 200,
    status: "OK",
    data: data,
  };
  return HttpResponse.json<ResponseBody<T>>(response);
};

export const handlers = [
  http.get<
    never,
    never,
    ResponseBody<User | ApiError>,
    "http://api.test.test/users/:userId"
  >("http://api.test.test/users/:userId", ({ request }) => {
    if (!request.headers.get("Authorization")) {
      return errorResponse(401);
    }

    const userData: User = {
      id: 235150200111051,
      name: "Khaelano Abroor Maulana",
      faculty: "Filkom",
      major: "Teknik Informatika",
      email: "khaelanoabroor@student.ub.ac.id",
      year: 2023,
      creditScore: 80,
      profilePictUrl: "https://fpoimg.com/150",
    };

    return successResponse(userData);
  }),

  http.get<
    { userId: string },
    never,
    ResponseBody<PagedData<History> | ApiError>,
    "http://api.test.test/users/:userId/histories"
  >("http://api.test.test/users/:userId/histories", ({ request }) => {
    const url = new URL(request.url);

    const offset = parseInt(url.searchParams.get("offset") ?? "0");
    const limit = parseInt(url.searchParams.get("limit") ?? "15");
    const total = 100;

    const histories: History[] = [];
    for (let i = offset; i < offset + limit; i++) {
      const history: History = {
        id: i,
        tvId: i,
        consoleType: "XBOX",
        reservationDateTime: "2025-06-14T13:47:22Z",
        tvPictUrl: "https://fpoimg.com/360",
      };
      histories.push(history);
    }

    const pagedData: PagedData<History> = {
      offset,
      limit,
      total,
      data: histories,
    };

    return successResponse(pagedData);
  }),

  http.get<
    { userId: string; histId: string },
    never,
    ResponseBody<History | ApiError>,
    "http://api.test.test/users/:userId/histories/:histId"
  >("http://api.test.test/users/:userId/histories/:histId", () => {
    const history: History = {
      id: 1,
      tvId: 1,
      consoleType: "XBOX",
      reservationDateTime: "2025-06-14T13:47:22Z",
      tvPictUrl: "https://fpoimg.com/360",
    };

    return successResponse(history);
  }),

  http.post<
    never,
    LoginBody,
    ResponseBody<TokenCarrier | ApiError>,
    "http://api.test.test/login"
  >("http://api.test.test/login", async ({ request }) => {
    const { identifier, password } = await request.json();
    if (identifier !== "test" || password !== "test") {
      return errorResponse(401);
    }

    const tokenCarrier: TokenCarrier = {
      authToken: "contohauthtoken",
      userId: 235150200111051,
      expDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return successResponse(tokenCarrier);
  }),

  http.post<
    never,
    never,
    ResponseBody<TokenCarrier | ApiError>,
    "http://api.test.test/refresh"
  >("http://api.test.test/refresh", () => {
    const tokenCarrier: TokenCarrier = {
      authToken: "contohauthtoken",
      userId: 235150200111051,
      expDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return successResponse(tokenCarrier);
  }),

  http.get<
    never,
    never,
    ResponseBody<GameCornerInfo | ApiError>,
    "http://api.test.test/tvs"
  >("http://api.test.test/tvs", () => {
    type Game = {
      id: number;
      title: string;
      coverPictUrl: string;
    };

    const gameIds = [1, 2, 3, 4, 5, 6];
    const gameList: Game[] = gameIds.map((id) => ({
      id: id,
      title: "Game Title Placeholder",
      coverPictUrl:
        "https://fpoimg.com/800x400?text=Preview&bg_color=e6e6e6&text_color=8F8F8F",
    }));

    const cornerInfo: GameCornerInfo = {
      tvIdList: [1, 2, 3, 4, 5],
      gameList: gameList,
    };

    return successResponse(cornerInfo);
  }),

  http.get<
    { tvId: string },
    never,
    ResponseBody<TV | ApiError>,
    "http://api.test.test/tvs/:tvId/reservations"
  >("http://api.test.test/tvs/:tvId/reservations", () => {
    const timeSlots: {
      startTime: string;
      endTime: string;
      availability: "available" | "unavailable" | "unknown";
    }[] = [];

    for (let i = 0; i < 8; i++) {
      const startTime = `${10 + i}:00`;
      const endTime = `${11 + i}:00`;

      timeSlots.push({
        startTime: startTime,
        endTime: endTime,
        availability: "available",
      });
    }

    const tv: TV = {
      id: 1,
      consoleType: "PS5",
      timeSlots: timeSlots,
    };
    return successResponse(tv);
  }),

  http.post<
    { tvId: string },
    ReservationBody,
    ResponseBody<null | ApiError>,
    "http://api.test.test/tvs/:tvId/reservations"
  >("http://api.test.test/tvs/:tvId/reservations", () => {
    return successResponse(null);
  }),
];
