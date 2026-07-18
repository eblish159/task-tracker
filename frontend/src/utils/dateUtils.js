export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 최근 7일, 14일, 30일
export function getQuickRange(days) {
  const end = new Date();
  const start = new Date();

  start.setDate(end.getDate() - (days - 1));

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

// 이번 주 월요일부터 오늘까지
export function getThisWeekRange() {
  const today = new Date();
  const start = new Date(today);

  const dayOfWeek = today.getDay();

  // 일요일은 6일 전, 나머지는 해당 주 월요일 계산
  const differenceToMonday =
    dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  start.setDate(today.getDate() + differenceToMonday);

  return {
    startDate: formatDate(start),
    endDate: formatDate(today),
  };
}

// 이번 달 1일부터 오늘까지
export function getThisMonthRange() {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  return {
    startDate: formatDate(start),
    endDate: formatDate(now),
  };
}