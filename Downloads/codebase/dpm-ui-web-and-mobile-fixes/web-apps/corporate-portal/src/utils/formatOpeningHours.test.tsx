import {  getWorkingHoursForDay } from "./formatOpeningHours"; // Adjust path

type WorkingDays = {
    [key: string]: string; 
  };
  interface Time {
    hours: number;
    minutes: number;
  }


const workingDays:WorkingDays = {
    SUNDAY: "Sunday",
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
  };

  jest.mock("../constant", () => ({
    commonKeywords: {
        closed: "Closed",
    },
  }));


describe("getWorkingHoursForDay", () => {
  const mockTransformedData = [
    { day: workingDays.MONDAY, workingHour: "09:00AM - 05:00PM" },
    { day: workingDays.TUESDAY, workingHour: "10:30AM - 06:00PM" }
  ];

  it("should return working hours for a given day", () => {
    expect(getWorkingHoursForDay(mockTransformedData, "Monday")).toEqual([{ day: workingDays.MONDAY, workingHour: "09:00AM - 05:00PM" }]);
  });

  it("should return empty array if no working hours found for the given day", () => {
    expect(getWorkingHoursForDay(mockTransformedData, "Sunday")).toEqual([]);
  });
});
