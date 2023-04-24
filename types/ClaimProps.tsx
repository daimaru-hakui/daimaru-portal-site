export type ClaimProps = {
  claim: {
    customer: string;
    occurrenceDate: string;
    occurrenceSelect: string;
    occurrenceContent: string;
    amendmentSelect: string;
    amendmentContent: string;
    counterplanSelect: string;
    counterplanContent: string;
    author: string;
    stampStaff: string;
    stampCounterplan: string;
    stampOffice: string;
    stampBoss: string;
    stampManager: string;
    stampTm: string;
    status: string | number;
    operator: string;
    receptionNum: string;
    receptionDate: string;
    completionDate: string;
    causeDepartmentSelect: string;
    imageUrl1: string;
    imageUrl2: string;
    imageUrl3: string;
    imagePath1: string;
    imagePath2: string;
    imagePath3: string;
  };
  users: {
    uid: string;
    name: string;
  }[];
};
