import { Claim } from "../types";
import { create } from "zustand";

type State = {
  claims: Claim[];
  setClaims: (payload: Claim[]) => void;
  filterClaims: Claim[];
  setFilterClaims: (payload: Claim[]) => void;
  receptionDateStart: string;
  setReceptionDateStart: (payload: string) => void;
  receptionDateEnd: string;
  setReceptionDateEnd: (payload: string) => void;
  stampStaff: string;
  setStampStaff: (payload: string) => void;
  customer: string;
  setCustomer: (payload: string) => void;
  occurrence: string;
  setOccurrence: (payload: string) => void;
  amendment: string;
  setAmendment: (payload: string) => void;
  causeDepartment: string;
  setCauseDepartment: (payload: string) => void;
  counterplan: string;
  setCounterplan: (payload: string) => void;
};
// const { beginningDate } = useUtils();
export const useClaimStore = create<State>((set) => ({
  claims: [],
  setClaims: (payload) => set({ claims: payload }),
  filterClaims: [],
  setFilterClaims: (payload) => set({ filterClaims: payload }),
  receptionDateStart: "2022-03-01",
  setReceptionDateStart: (payload) => set({ receptionDateStart: payload }),
  receptionDateEnd: "",
  setReceptionDateEnd: (payload) => set({ receptionDateEnd: payload }),
  stampStaff: "",
  setStampStaff: (payload) => set({ stampStaff: payload }),
  customer: "",
  setCustomer: (payload) => set({ customer: payload }),
  occurrence: "",
  setOccurrence: (payload) => set({ occurrence: payload }),
  amendment: "",
  setAmendment: (payload) => set({ amendment: payload }),
  causeDepartment: "",
  setCauseDepartment: (payload) => set({ causeDepartment: payload }),
  counterplan: "",
  setCounterplan: (payload) => set({ counterplan: payload }),
}));
