interface Time {
  hours: number;
  minutes: number;
}

interface Period {
  openDay: Day;
  closeDay: Day;
  openTime: Time;
  closeTime: Time;
}

interface Data {
  periods: Period[];
}

import { commonKeywords, workingDays } from "../constant";

type Day =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

const formatWorkingTime = ({ hours, minutes }: Time): string => {
  const period = hours >= 12 ? "PM" : "AM";
  let minuteText: number | string = "00";
  if (Number.isInteger(minutes))
    minuteText = minutes < 10 ? `0${minutes}` : minutes;
  let hourText: number | string = "00";
  if (Number.isInteger(hours)) {
    const hour = hours % 12 || 12;
    hourText = hour < 10 ? `0${hour}` : hour;
  }
  return `${hourText}:${minuteText}${period}`;
};

export const getCurrentDay = (): string => {
  const days = [
    workingDays.SUNDAY,
    workingDays.MONDAY,
    workingDays.TUESDAY,
    workingDays.WEDNESDAY,
    workingDays.THURSDAY,
    workingDays.FRIDAY,
    workingDays.SATURDAY,
  ];
  const currentDayIndex = new Date().getDay();
  return days[currentDayIndex];
};

export const transformData = (
  data: Period[] = []
): { day: string; workingHour: string }[] => {
  const result: { day: string; workingHour: string }[] = [];

  const orderedDays: Day[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  orderedDays.forEach((day, index) => {
    const periods = data.filter(
      (period) =>
        period.openDay === day &&
        period.closeDay === day &&
        (Number.isInteger(period.openTime.hours) ||
          Number.isInteger(period.openTime.minutes))
    );
    if (periods && periods.length > 0) {
      const workingHours = periods
        .map((period) => {
          const openingTime = formatWorkingTime(period.openTime);
          let closingTime = formatWorkingTime(period.closeTime);
          if (period.closeTime.hours === 24) {
            const nextDay = orderedDays[(index + 1) % orderedDays.length];
            const closingTimeEntry = data.find(
              (item) =>
                item.openDay === nextDay &&
                Number.isInteger(item.openTime.hours) === false &&
                Number.isInteger(item.openTime.minutes) === false
            );
            if (closingTimeEntry !== undefined)
              closingTime = formatWorkingTime(closingTimeEntry.closeTime);
          }
          return `${openingTime} - ${closingTime}`;
        })
        .join(" & ");
      result.push({ day: workingDays[day], workingHour: workingHours });
    } else {
      result.push({
        day: workingDays[day],
        workingHour: commonKeywords.closed,
      });
    }
  });

  return result;
};

export const getWorkingHoursForDay = (
  data: { day: string; workingHour: string }[],
  day: string
): { day: string; workingHour: string }[] => {
  if (data.length === 0) {
    return [];
  }

  const result = data.filter(
    (item) => item.day.toLowerCase() === day.toLowerCase()
  );
  return result.length > 0 ? result : [];
};
