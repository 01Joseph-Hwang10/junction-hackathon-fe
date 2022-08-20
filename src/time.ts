// 앱 시작시간
export const app_start_date = new Date();

// 과거 시간 시작 시간
const start_date = new Date(2021, 1, 1);

// area 시간 비율
export let area_date_multiply_value = 4;

export const getAreaTimeWithStartDate = (startDate: Date | string) => {
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
