export type Request = {
  id: string;
  title: string;
  startDay: string;
  startTime: string;
  endEnd: string;
  endTime: string;
  applicant: string;
  person: string;
  moreless: string;
  member: string[];
  level: string;
  content: string;
  display: boolean;
  deleteAt: boolean;
  editAt: boolean;
  sendAt: any;
  recruitment: boolean;
  author: string;
  endDay: string;
}
export type RequestInputs = {
  title: string;
  startDay: string;
  startTime: string;
  endDay: string;
  endTime: string;
  applicant: string;
  person: string;
  moreless: string;
  level: string;
  content: string;
  };

export type User = {
  uid: string;
  name: string;
  rank: number;
  isoSalesStaff: boolean;
  isoBoss: boolean;
  isoManager: boolean;
  isoOffice: boolean;
  isoTopManegment: boolean;
  alcoholChecker: boolean;
};
