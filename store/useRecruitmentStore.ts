import { create } from "zustand";
import { Request } from "../types";

type State = {
  requests: Request[];
  setRequests: (payload: Request[]) => void;
};

export const useRecruitmentStore = create<State>((set) => ({
  requests: [],
  setRequests: (payload) => set({ requests: payload }),
}));
