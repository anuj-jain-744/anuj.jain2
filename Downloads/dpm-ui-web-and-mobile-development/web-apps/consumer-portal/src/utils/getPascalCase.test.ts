import { getPascalCase } from './getPascalCase';

describe('getPascalCase', () => {
  it('should return the string in pascal case', () => {
    expect(getPascalCase('hello world')).toBe('Hello World');
    expect(getPascalCase('this is a test')).toBe('This Is A Test');
    expect(getPascalCase('another example')).toBe('Another Example');
  });

  it('should return an empty string if input is undefined', () => {
    expect(getPascalCase(undefined)).toBe('');
  });

  it('should return an empty string if input is an empty string', () => {
    expect(getPascalCase('')).toBe('');
  });
});