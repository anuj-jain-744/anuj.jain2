import { formatDate, convertToDateString } from './formatDate';

describe('formatDate', () => {
  it('should format the date correctly', () => {
    expect(formatDate('2023-10-15')).toBe('15/10/2023');
    expect(formatDate('2022-01-01')).toBe('01/01/2022');
    expect(formatDate('1999-12-31')).toBe('31/12/1999');
  });

});

describe('convertToDateString', () => {
  it('should convert the date to the correct string format', () => {
    expect(convertToDateString('2023-10-15')).toBe('15 Oct, 2023');
    expect(convertToDateString('2022-01-01')).toBe('01 Jan, 2022');
    expect(convertToDateString('1999-12-31')).toBe('31 Dec, 1999');
  });

  it('should throw an error for invalid date formats', () => {
    expect(() => convertToDateString('invalid-date')).toThrow('Invalid date format');
  });
});