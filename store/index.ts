import { atom } from "recoil";
import { Request, User } from "../types";
export const spinnerAtom = atom({
  key: "spinnerAtom",
  default: false,
});

export const claimsState = atom({
  key: "claimsState",
  default: [],
});

export const usersState = atom<User[]>({
  key: "usersState",
  default: [],
});

export const requestsState = atom<Request[]>({
  key: "requestsState",
  default: [],
});

export const hideRequestsState = atom({
  key: "hideRequestsState",
  default: [],
});

//クレーム報告書 フィルター
////////////////////////////////////////
export const receptionDateStartState = atom({
  key: "receptionDateStartState",
  default: "",
});

export const receptionDateEndState = atom({
  key: "receptionDateEndState",
  default: "",
});

export const stampStaffState = atom({
  key: "stampStaffState",
  default: "",
});

export const occurrenceState = atom({
  key: "occurrenceState",
  default: "",
});
export const customerState = atom({
  key: "customerState",
  default: "",
});

export const amendmentState = atom({
  key: "amendmentState",
  default: "",
});

export const counterplanState = atom({
  key: "counterplanState",
  default: "",
});

export const causeDepartmentState = atom({
  key: "causeDepartmentState",
  default: "",
});
////////////////////////////////////////
