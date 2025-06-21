import { validateDaysToExpiry } from "constant";
import { defaultAPIDateUI } from "components/Travel/constantsTravel";
import { DateObject } from "react-multi-date-picker";

function replaceMonthtoDate(inputDate: string): string {
  const dateFormat = inputDate?.split('-');
  const month = dateFormat[1];
  const year = dateFormat[2];
  const day = dateFormat[0];
  return `${month}/${day}/${year}`;
}

function formatDate(inputDate: string | Date): string {
  const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
  // Ensure the date is treated as UTC
  const day = String(date?.getUTCDate()).padStart(2, '0');
  const month = String(date?.getUTCMonth() + 1).padStart(2, '0');
  const year = date?.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

function apiFormatDate(inputDate: string, seperator: string = '-'): string {
  const dateFormat = inputDate?.split(seperator);
  return `${dateFormat[2]}-${dateFormat[1]}-${dateFormat[0]}`;
}

function formatDateMMYYYY(inputDate: string): string {
  const dateFormat = inputDate?.split('-');
  return `${dateFormat[1]}/${dateFormat[0]}`;
}

function convertToDateString(inputDate: string): string {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month}, ${year}`;
}

function checkAgeLimit(inputDate: string) {
  const selectedDate: any = new Date(inputDate);
  const futureDate: any = new Date(new Date().setDate(new Date().getDate() + 45));
  const dayDiff = Math.round((futureDate - selectedDate) / (1000 * 60 * 60 * 24));
  return { value: inputDate, error: (dayDiff < 0)}
}

const convertYear = (value: string) => {
  const number = Number(value)
  const todayDate = new Date();
  return todayDate.getFullYear() - number;
}

function checkDateFormat(date: string | Date){
  return typeof date === 'string' ? date.split("/").reverse().join("-") : date;
}

const getRemainingDays = (date: string): number => {
  if (!date) return NaN;
  const dateToCompare = new Date(date);
  if (isNaN(dateToCompare.getTime())) return NaN;
  const today = new Date();
  const diffTime = dateToCompare.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

 const isValidDate = (stringDate?: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(stringDate ?? "");
};
 const isExpiringSoon = (daysToExpiry: number) =>
  daysToExpiry >= 0 && daysToExpiry <= validateDaysToExpiry;

 const isRecentlyExpired = (daysToExpiry: number) =>
  daysToExpiry < 0 && daysToExpiry >= -validateDaysToExpiry;

 const isPolicyExpiredAndAlertable = (policy: any, allPolicies: any[]): boolean => {
  const expiryDays = getRemainingDays(policy?.expiryDate);
  // Only expired within last -45 days
  if (expiryDays > 0 || expiryDays < -validateDaysToExpiry) {
    return false;
  }
  const hasReplacement = allPolicies.some(p =>
    p?.ownerId === policy?.ownerId &&
    p?.policyNo !== policy?.policyNo &&
    getRemainingDays(p?.expiryDate) > 0
  );
  return !hasReplacement;
};

export const isValidCalendarDate = (stringDate?: string) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(stringDate ?? "");
};

export const formatTravelDate = (date: string) => {
  if (date) {
    const isValid = isValidDate(date);
    if (isValid === false) {
      const [day, month, year] = date.includes("/")
        ? date.split("/")
        : date.split("-");
      return `${year}-${month}-${day}`;
    }
    return date;
  }
  return "";
};

const formatDateYYYYMMDD = (dateVal?: Date| string) => {
  const date = dateVal ?  new Date(dateVal): new Date();

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${year}-${month}-${day}`;
}

export function formatDateToISO(date: string | undefined): string {
  if (!date) {
    throw new Error("Invalid date input: date is undefined or empty.");
  }

  const parts = date.split('/');
  if (parts.length !== 3) {
    throw new Error("Invalid date format: expected DD/MM/YYYY.");
  }

  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

export const formatToCalendarDate = (date: string) => {
  if (date && date.length === 10 && date !== defaultAPIDateUI) {
    const isValid = isValidCalendarDate(date);
    if (isValid === false) {
      const [year, month, day] = date.includes("-")
        ? date.split("-")
        : date.split("/");
      return `${day}/${month}/${year}`;
    }
    return date;
  }
  return "";
};

const getDateForDriverDetailApi = (dob: string | undefined, isHizri: boolean): string => {
  if(!dob) return "";
  const parts = dob.split("-");
  return isHizri ? `${parts[1]}-${parts[2]}` : `${parts[1]}-${parts[0]}` ;
}



export const formatDateObjectTo = (date: DateObject, format:string) => date.format(format);

export {
  formatDate,
  convertToDateString,
  checkAgeLimit,
  convertYear,
  apiFormatDate,
  formatDateMMYYYY,
  checkDateFormat,
  getRemainingDays,
  formatDateYYYYMMDD,
  isExpiringSoon,
  replaceMonthtoDate,
  isPolicyExpiredAndAlertable,
  isRecentlyExpired,
  getDateForDriverDetailApi
};
