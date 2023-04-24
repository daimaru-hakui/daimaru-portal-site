export const starLevel = (level) => {
  if (level === "1") return "★";
  if (level === "2") return "★★";
  if (level === "3") return "★★★";
  if (level) return level;
};

//日付から曜日を取得
export const dayOfWeek = (d) => {
  if (d == "未定") return "";
  let date = new Date(d);
  let number = date.getDay();
  return `（${["日", "月", "火", "水", "木", "金", "土"][number]}）`;
};

//今日の日付を取得
export const todayDate = () => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  month = ("0" + month).slice(-2);
  let date = newDate.getDate();
  date = ("0" + date).slice(-2);
  return `${year}-${month}-${date}`;
};

//今日の日付時間を取得
export const datetime = () => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  month = ("0" + month).slice(-2);
  let date = newDate.getDate();
  date = ("0" + date).slice(-2);
  let hours = newDate.getHours();
  hours = ("0" + hours).slice(-2);
  let minutes = newDate.getMinutes();
  minutes = ("0" + minutes).slice(-2);
  return `${year}-${month}-${date} ${hours}:${minutes}`;
};

export const beginningDate = () => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  if (month < 3) {
    return `${year - 1}-03-01`;
  } else {
    return `${year}-03-01`;
  }
};

//時間の select value を作成
let date = [];
for (let i = 6; i <= 24; i++) {
  for (let j = 0; j <= 3; j++) {
    if (j === 1 || j === 2) continue;
    if (i === 24 && j === 3) continue;
    date.push(i + ":" + j + "0");
  }
}
export const dateTime = date;
