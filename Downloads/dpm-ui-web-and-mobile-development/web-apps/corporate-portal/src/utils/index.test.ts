import { getFullUrl, chunkArray } from './index';

// Test for getFullUrl function
describe('getFullUrl', () => {
  it('should return the correct full URL', () => {
    const baseUrl = 'http://example.com';
    const lang = 'en';
    const route = 'users';
    const expectedUrl = 'http://example.com/en/api/users';
    expect(getFullUrl(baseUrl, lang, route)).toBe(expectedUrl);
  });
});

// Test for chunkArray function
describe('chunkArray', () => {
  it('should chunk array into smaller arrays of given size', () => {
    const arr = [1, 2, 3, 4, 5];
    const size = 2;
    const expectedChunks = [[1, 2], [3, 4], [5]];
    expect(chunkArray(arr, size)).toEqual(expectedChunks);
  });

  it('should return an empty array when input array is empty', () => {
    const arr: number[] = [];
    const size = 2;
    const expectedChunks: number[][] = [];
    expect(chunkArray(arr, size)).toEqual(expectedChunks);
  });

  it('should handle size larger than array length', () => {
    const arr = [1, 2, 3];
    const size = 5;
    const expectedChunks = [[1, 2, 3]];
    expect(chunkArray(arr, size)).toEqual(expectedChunks);
  });

  it('should handle size of 1', () => {
    const arr = [1, 2, 3];
    const size = 1;
    const expectedChunks = [[1], [2], [3]];
    expect(chunkArray(arr, size)).toEqual(expectedChunks);
  });
});