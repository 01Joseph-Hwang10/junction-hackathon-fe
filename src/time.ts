//// time

// 앱 시작시간
const app_start_date = new Date();

// 과거 시간 시작 시간
const start_date = new Date(2021, 1, 1);

// area 시간 비율
let area_date_multiply_value = 4;

const getAreaTimeWithStartDate = (startDate: Date | string) => {
  // area 생성 일시
  const area_start_date = new Date(startDate);

  // area 현재 시간
  const area_now_date = new Date();

  const area_gap = Number(area_now_date) - Number(area_start_date);
  const start_gap = Number(area_start_date) - Number(start_date);

  const date = new Date(
    Number(area_now_date) + area_gap * area_date_multiply_value - start_gap
  );

  return date;
};

ScriptApp.onStart.Add(() => {
  setInterval(() => {
    // ScriptApp.sayToAll(">>>>>>>>>>>>>>>");
    const date = getAreaTimeWithStartDate(app_start_date);
    // ScriptApp.sayToAll(">>>>>>>>>>>>>>>" + " " + date);
    const formattedDate = `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`;
    // ScriptApp.sayToAll(">>>>>>>>>>>>>>>" + " " + formattedDate);
    ScriptApp.showCenterLabel(formattedDate);
  }, 1000 / (area_date_multiply_value + 1));
});

export {};
