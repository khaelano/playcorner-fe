import { create, type StateCreator } from "zustand";

import {
  type ResponseBody,
  type LoginBody,
  type TokenCarrier,
} from "./api/schema";
import { client } from "./api/client";

interface AuthSlice {
  authStatus: "unknown" | "authenticated" | "unauthenticated" | "pending";
  authToken: string | null;
  userId: number | null;
  login: ({ identifier, password }: LoginBody) => void;
  setAuthToken: (token: string) => void;
}

const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  authStatus: "unknown",
  authToken: null,
  userId: !import.meta.env.DEV ? null : 1,
  login: async ({ ...loginBody }) => {
    set({ authStatus: "pending" });

    try {
      const response = await client.post<ResponseBody<TokenCarrier>>(
        "/auth/login",
        loginBody,
      );
      if (response.status !== 200) {
        set({ authStatus: "unauthenticated" });
      }

      set({
        authStatus: "authenticated",
        authToken: response.data.data.authToken,
        userId: response.data.data.userId,
      });
    } catch (e) {
      set({ authStatus: "unauthenticated", authToken: null, userId: null });
      console.log(e);
    }
  },
  setAuthToken: (token) => set({ authToken: token }),
});

export const useGlobalStore = create<AuthSlice>((...a) => ({
  ...createAuthSlice(...a),
}));
