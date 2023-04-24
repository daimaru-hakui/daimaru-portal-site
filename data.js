//管理者
export const Administrator = [
  "EVKsigM546MbnakzkDmG0QHlfmn2", //社長
  "MBTOK9Jr0eRWVuoT2YXgZNMoBQH3", //向井
];

export const taskflow = [
  { id: 0, status: "未処理" },
  { id: 1, status: "修正処置" },
  { id: 2, status: "起因部署選択" },
  { id: 3, status: "対策記入" },
  { id: 4, status: "内容確認" },
  { id: 5, status: "上司承認" },
  { id: 6, status: "管理者承認" },
  { id: 7, status: "ＴＭ承認" },
  { id: 8, status: "完了" },
];

//クレーム報告書
export const claimSelectList1 = [
  {
    id: "1",
    headline: "製品起因",
    title: "製品不良",
  },
  {
    id: "2",
    headline: "製品起因",
    title: "納品書",
  },
  {
    id: "3",
    headline: "製品起因",
    title: "商品間違い",
  },
  {
    id: "4",
    headline: "製品起因",
    title: "その他",
  },
  {
    id: "5",
    headline: "受発注",
    title: "住所等",
  },
  {
    id: "6",
    headline: "受発注",
    title: "未納品",
  },
  {
    id: "7",
    headline: "受発注",
    title: "その他",
  },
  {
    id: "8",
    headline: "その他",
    title: "その他",
  },
];

export const claimSelectList2 = [
  {
    id: "1",
    title: "商品再手配",
  },
  {
    id: "2",
    title: "顧客への説明・交渉",
  },
  {
    id: "3",
    title: "伝票再発行",
  },
  {
    id: "4",
    title: "その他",
  },
];

export const claimSelectList3 = [
  {
    id: "1",
    title: "修正処置のみ",
  },
  {
    id: "2",
    title: "書面提出",
  },
  {
    id: "3",
    title: "改善の機会",
  },
  {
    id: "4",
    title: "是正処置",
  },
];

export const claimSelectList4 = [
  {
    id: "1",
    title: "R&D事業部",
  },
  {
    id: "2",
    title: "他社・メーカー",
  },
  {
    id: "3",
    title: "徳島工場",
  },
  {
    id: "4",
    title: "営業部",
  },
  {
    id: "5",
    title: "配送センター",
  },
  {
    id: "6",
    title: "経理部",
  },
  {
    id: "7",
    title: "顧客",
  },
  {
    id: "8",
    title: "不明",
  },
];
