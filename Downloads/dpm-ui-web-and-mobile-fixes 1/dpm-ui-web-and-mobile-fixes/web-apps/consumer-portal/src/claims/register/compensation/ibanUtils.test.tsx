import { validateIBAN } from './ibanUtils';

describe('validateIBAN', () => {
  test('returns true for a valid IBAN', () => {
    const validIBAN = 'SA0380000000608010167519';
    expect(validateIBAN(validIBAN)).toBe(true);
  });

  test('returns false for an IBAN with invalid format', () => {
    const invalidFormatIBAN = 'SA038000000060801016751';
    expect(validateIBAN(invalidFormatIBAN)).toBe(false);
  });

  test('returns false for an IBAN with invalid country code', () => {
    const invalidCountryIBAN = 'XX0380000000608010167519';
    expect(validateIBAN(invalidCountryIBAN)).toBe(false);
  });

  test('returns false for an IBAN with incorrect length', () => {
    const incorrectLengthIBAN = 'SA038000000060801016751';
    expect(validateIBAN(incorrectLengthIBAN)).toBe(false);
  });

  test('returns false for an IBAN with invalid checksum', () => {
    const invalidChecksumIBAN = 'SA0380000000608010167518';
    expect(validateIBAN(invalidChecksumIBAN)).toBe(false);
  });

  test('returns true for another valid IBAN', () => {
    const anotherValidIBAN = 'GB82WEST12345698765432';
    expect(validateIBAN(anotherValidIBAN)).toBe(true);
  });
});