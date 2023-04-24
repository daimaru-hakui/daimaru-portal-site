export type ProgressType = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    contents: { title: string; result: boolean }[];
}