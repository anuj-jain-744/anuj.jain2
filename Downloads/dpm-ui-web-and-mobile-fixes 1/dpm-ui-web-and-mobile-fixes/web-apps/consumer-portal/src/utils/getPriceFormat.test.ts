import { getPriceFormat } from './getPriceFormat';

describe('getPriceFormat', () => {
  it('should format 95000 to "95,000.00"', () => {
    expect(getPriceFormat(95000)).toBe("95,000.00");
  });

  it('should format 1234567 to "1,234,567.00"', () => {
    expect(getPriceFormat(1234567)).toBe("1,234,567.00");
  });

  it('should format 0 to "0.00"', () => {
    expect(getPriceFormat(0)).toBe("0.00");
  });

  it('should format 1234.56 to "1,234.56"', () => {
    expect(getPriceFormat(1234.56)).toBe("1,234.56");
  });

  it('should format 1000000.99 to "1,000,000.99"', () => {
    expect(getPriceFormat(1000000.99)).toBe("1,000,000.99");
  });

  it('should format 1000 to "1,000.00"', () => {
    expect(getPriceFormat(1000)).toBe("1,000.00");
  });
});