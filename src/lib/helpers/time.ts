import { DAYS, MONTHS } from "$lib/constants";

export const groupDates = (day: number, date: number, month: number) => {
  return `${DAYS[day]}, ${MONTHS[month]} ${date}`;
};

export const mediaTime = (hours: number, minutes: number) => {
  const period = hours > 12 ? "PM" : "AM";
  return `${hours % 12}:${minutes} ${period}`;
};
