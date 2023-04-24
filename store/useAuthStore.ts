import { UserInfo } from "@firebase/auth-types";
import { create } from "zustand";
type State = {
  session: UserInfo | null;
  setSession: (payload: UserInfo | null) => void;
  currentUser: string | undefined;
  setCurrentUser: (payload: string | undefined) => void;
};

export const useAuthStore = create<State>((set) => ({
  session: null,
  setSession: (payload) => set({ session: payload }),
  currentUser: undefined,
  setCurrentUser: (payload) => set({ currentUser: payload }),
}));
