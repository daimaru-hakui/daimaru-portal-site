import { UserInfo } from "@firebase/auth-types";
import { create } from "zustand";
import { User } from "../types";

type State = {
  session: UserInfo | null;
  setSession: (payload: UserInfo | null) => void;
  currentUser: string | "";
  setCurrentUser: (payload: string | undefined) => void;
  users: User[] | [];
  setUsers: (payload: User[] | []) => void;
};

export const useAuthStore = create<State>((set) => ({
  session: null,
  setSession: (payload) => set({ session: payload }),
  currentUser: "",
  setCurrentUser: (payload) => set({ currentUser: payload }),
  users: [],
  setUsers: (payload) => set({ users: payload }),
}));
