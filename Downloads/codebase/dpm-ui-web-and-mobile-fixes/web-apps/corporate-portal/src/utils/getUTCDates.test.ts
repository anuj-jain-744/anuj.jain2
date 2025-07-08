import { getUTCFormattedDate } from './getUTCDates';

describe('getUTCFormattedDate', () => {
    it('should return the current UTC date in YYYY-MM-DD format', () => {
        const mockDate = new Date(Date.UTC(2023, 9, 15)); // Mock date: October 15, 2023
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        const result = getUTCFormattedDate();
        expect(result).toBe('2023-10-15');

        jest.restoreAllMocks();
    });

    it('should pad single-digit day and month with leading zeros', () => {
        const mockDate = new Date(Date.UTC(2023, 0, 5)); // Mock date: January 5, 2023
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        const result = getUTCFormattedDate();
        expect(result).toBe('2023-01-05');

        jest.restoreAllMocks();
    });
});