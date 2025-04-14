import { getPlateNumber } from './getPlateNumber';

describe('getPlateNumber', () => {
  test('returns correct plate number when all fields are provided', () => {
    const vehicleDetail = {
      plateNo: '1234',
      plateNoText1: 'ABC',
      plateNoText2: 'DEF',
      plateNoText3: 'GHI',
    };
    const result = getPlateNumber(vehicleDetail);
    expect(result).toBe('1234 - ABCDEFGHI');
  });

  test('returns correct plate number when some optional fields are missing', () => {
    const vehicleDetail = {
      plateNo: '1234',
      plateNoText1: 'ABC',
      plateNoText2: '',
      plateNoText3: 'GHI',
    };
    const result = getPlateNumber(vehicleDetail);
    expect(result).toBe('1234 - ABCGHI');
  });

  test('returns correct plate number when all optional fields are missing', () => {
    const vehicleDetail = {
      plateNo: '1234',
      plateNoText1: '',
      plateNoText2: '',
      plateNoText3: '',
    };
    const result = getPlateNumber(vehicleDetail);
    expect(result).toBe('1234 - ');
  });

  test('returns correct plate number when only plateNumber is provided', () => {
    const vehicleDetail = {
      plateNo: '1234',
      plateNoText1: '',
      plateNoText2: '',
      plateNoText3: '',
    };
    const result = getPlateNumber(vehicleDetail);
    expect(result).toBe('1234 - ');
  });

  test('returns correct plate number when plateNumber is empty', () => {
    const vehicleDetail = {
      plateNo: '',
      plateNoText1: 'ABC',
      plateNoText2: 'DEF',
      plateNoText3: 'GHI',
    };
    const result = getPlateNumber(vehicleDetail);
    expect(result).toBe(' - ABCDEFGHI');
  });
});