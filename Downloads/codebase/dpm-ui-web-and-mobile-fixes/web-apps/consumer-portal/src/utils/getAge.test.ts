import { getAge } from './getAge';

describe('getAge', () => {
  it('should return the correct age for a valid date of birth', () => {
    const dob = '2000-01-01';
    expect(getAge(dob)).toBe(new Date().getFullYear() - 2000);
  });

  it('should return the correct age when birthday has not occurred this year', () => {
    const dob = '2000-12-31';
    const currentYear = new Date().getFullYear();
    expect(getAge(dob)).toBe(currentYear - 2001);
  });

  it('should return the correct age when birthday is today', () => {
    const today = new Date();
    const dob = today.toISOString().split('T')[0];
    expect(getAge(dob)).toBe(0);
  });

  it('should handle invalid date strings gracefully', () => {
    const dob = 'invalid-date';
    expect(getAge(dob)).toBeNaN();
  });

  it('should handle empty string input', () => {
    const dob = '';
    expect(getAge(dob)).toBeNaN();
  });
});