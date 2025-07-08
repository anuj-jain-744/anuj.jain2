import { getFullAge } from './getFullAge';

describe('getFullAge', () => {
    beforeAll(() => {
        // Mock the current date to July 4, 2025
        jest.useFakeTimers().setSystemTime(new Date('2025-07-04T00:00:00Z').getTime());
    });

    afterAll(() => {
        // Restore the original timers
        jest.useRealTimers();
    });
    it('should return the correct age for a valid date of birth', () => {
        const dateOfBirth = '04-07-2000'; // July 4, 2000
        const separator = '-';
        const age = getFullAge(dateOfBirth, separator);
        expect(age).toBe(25); // Assuming today is July 4, 2025
    });

    it('should return the correct age when the birthday has not occurred this year', () => {
        const dateOfBirth = '05-07-2000'; // July 5, 2000
        const separator = '-';
        const age = getFullAge(dateOfBirth, separator);
        expect(age).toBe(24); // Assuming today is July 4, 2025
    });

    it('should handle different separators correctly', () => {
        const dateOfBirth = '04/07/2000'; // July 4, 2000
        const separator = '/';
        const age = getFullAge(dateOfBirth, separator);
        expect(age).toBe(25); // Assuming today is July 4, 2025
    });
});