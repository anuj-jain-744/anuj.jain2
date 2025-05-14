import { subtractDates } from './subtractDates';

describe('subtractDates', () => {
  it('should return the correct difference in days between two dates', () => {
    expect(subtractDates('01/01/2022', '01/01/2022')).toBe(0);
    expect(subtractDates('02/01/2022', '01/01/2022')).toBe(1);
    expect(subtractDates('01/02/2022', '01/01/2022')).toBe(31);
    expect(subtractDates('01/01/2023', '01/01/2022')).toBe(365);
  });

  it('should handle leap years correctly', () => {
    expect(subtractDates('01/03/2020', '01/03/2019')).toBe(366);
  });

  it('should throw a TypeError if inputs are not strings', () => {
    expect(() => subtractDates(123, '01/01/2022')).toThrow(TypeError);
    expect(() => subtractDates('01/01/2022', 123)).toThrow(TypeError);
    expect(() => subtractDates(123, 123)).toThrow(TypeError);
  });
});