import { Claim } from "../types";
import { create } from "zustand";

type State = {
  claims: Claim[];
  setClaims: (payload: Claim[]) => void;
};

export const useClaimStore = create<State>((set) => ({
  claims: [],
  setClaims: (payload) => set({ claims: payload }),
}));
