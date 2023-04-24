export const useUtils = () => {
  const starLevel = (level: string) => {
    if (level === "1") return "★";
    if (level === "2") return "★★";
    if (level === "3") return "★★★";
    if (level) return level;
  };

  //日付から曜日を取得
  const dayOfWeek = (d: string) => {
    if (d == "未定") return "";
    let date = new Date(d);
    let number = date.getDay();
    return `(${["日", "月", "火", "水", "木", "金", "土"][number]})`;
  };

  //今日の日付を取得
  const todayDate = () => {
    const newDate = new Date();
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const monthStr = ("0" + month).slice(-2);
    const date = newDate.getDate();
    const dateStr = ("0" + date).slice(-2);
    return `${year}-${monthStr}-${dateStr}`;
  };

  //今日の日付時間を取得
  const datetime = () => {
    const newDate = new Date();
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const monthStr = ("0" + month).slice(-2);
    const date = newDate.getDate();
    const dateStr = ("0" + date).slice(-2);
    const hours = newDate.getHours();
    const hoursStr = ("0" + hours).slice(-2);
    const minutes = newDate.getMinutes();
    const minutesStr = ("0" + minutes).slice(-2);
    return `${year}-${monthStr}-${dateStr} ${hoursStr}:${minutesStr}`;
  };

  const beginningDate = () => {
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
  const dateTime = date;
  return { starLevel, dayOfWeek, todayDate, datetime, beginningDate, dateTime };
};
