import { atom } from "recoil";
import { Claim } from "../types";

export const claimsState = atom<Claim[]>({
  key: "claimsState",
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
