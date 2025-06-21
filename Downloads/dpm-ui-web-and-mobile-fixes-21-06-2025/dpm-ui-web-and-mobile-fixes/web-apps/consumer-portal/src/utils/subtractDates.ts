function subtractDates(date1Str, date2Str) {
  if (typeof date1Str !== "string" || typeof date2Str !== "string") {
    return 0;
    // throw new TypeError("Both inputs must be strings in the format DD/MM/YYYY");
  }

  const [day1, month1, year1] = date1Str.split("/").map(Number);
  const [day2, month2, year2] = date2Str.split("/").map(Number);

  const date1 = new Date(year1, month1 - 1, day1);
  const date2 = new Date(year2, month2 - 1, day2);

  const differenceInTime = date1 - date2;

  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return differenceInDays;
}

export { subtractDates };
