import { classifyTravelersByAge, travelerAgeCounts } from "./classifyTravelersByAge";
import { getAge } from "./getAge";

// Mock the getAge function
jest.mock("./getAge", () => ({
  getAge: jest.fn(),
}));

describe("classifyTravelersByAge", () => {
  it("should correctly classify travelers into child, adult, and senior categories", () => {
    const travelers = [
      { id: 1, dob: "2020-01-01" }, // 5 years old (child)
      { id: 2, dob: "2000-01-01" }, // 25 years old (adult)
      { id: 3, dob: "1950-01-01" }, // 75 years old (senior)
      { id: 4, dob: "2015-01-01" }, // 10 years old (child)
      { id: 5, dob: "1980-01-01" }, // 45 years old (adult)
    ];

    // Mock the ages returned by getAge
    (getAge as jest.Mock).mockImplementation((dob: string) => {
      const currentYear = new Date().getFullYear();
      const birthYear = new Date(dob).getFullYear();
      return currentYear - birthYear;
    });

    const expected: travelerAgeCounts = {
      child: 2,
      adult: 2,
      senior: 1,
    };

    const result = classifyTravelersByAge(travelers);

    expect(result).toEqual(expected);
  });

  it("should return all counts as 0 if no travelers are provided", () => {
    const travelers: any[] = [];
    const expected: travelerAgeCounts = {
      child: 0,
      adult: 0,
      senior: 0,
    };

    const result = classifyTravelersByAge(travelers);

    expect(result).toEqual(expected);
  });

  it("should handle edge cases for age boundaries", () => {
    const travelers = [
      { id: 1, dob: "2024-01-01" }, // 0.5 years old (child)
      { id: 2, dob: "2007-01-01" }, // 18 years old (adult)
      { id: 3, dob: "1960-01-01" }, // 65 years old (senior)
    ];

    (getAge as jest.Mock).mockImplementation((dob: string) => {
      const currentYear = new Date().getFullYear();
      const birthYear = new Date(dob).getFullYear();
      return currentYear - birthYear;
    });

    const expected: travelerAgeCounts = {
      child: 1,
      adult: 1,
      senior: 1,
    };

    const result = classifyTravelersByAge(travelers);

    expect(result).toEqual(expected);
  });
});