import { create } from "zustand";

type State = {
  isLoading: boolean;
  setIsLoading: (payload: boolean) => void;
};

export const useLoadingStore = create<State>((set) => ({
  isLoading: false,
  setIsLoading: (payload) => set({ isLoading: payload }),
}));
