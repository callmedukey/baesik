import { getDay } from "date-fns";

export function parseWeekDay(date: Date): string {
  const number = getDay(date);
  return ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][
    number
  ];
}
