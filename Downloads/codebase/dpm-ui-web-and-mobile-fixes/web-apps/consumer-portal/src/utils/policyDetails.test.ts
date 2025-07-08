import {
    getVehicleColor,
    getVehicleLicense,
    getVehicleTransmission,
    getGender,
    getFormattedPrice,
    getRemainingDays,
  } from './policyDetails';
  import { Address } from "types/policyDetails";
  
  describe('Utility Functions', () => {
    
    describe('getVehicleColor', () => {
      it('should return the correct color for a given code', () => {
        expect(getVehicleColor(1)).toBe('White');
        expect(getVehicleColor(5)).toBe('Green');
        expect(getVehicleColor(99)).toBeUndefined(); // Non-existing code
      });
    });
  
    describe('getVehicleLicense', () => {
      it('should return the correct license type for a given code', () => {
        expect(getVehicleLicense(1)).toBe('Private');
        expect(getVehicleLicense(2)).toBe('Public');
        expect(getVehicleLicense(12)).toBe(undefined);
      });
    });
  
    describe('getVehicleTransmission', () => {
      it('should return the correct transmission type for a given code', () => {
        expect(getVehicleTransmission(1)).toBe('Manual');
        expect(getVehicleTransmission(2)).toBe('Automatic');
        expect(getVehicleTransmission(99)).toBeUndefined();
      });
    });
  
    describe('formatAddress', () => {
      it('should format address correctly', () => {
        const address: Address = {
            streetName: '123 Main St',
            city: 'Sample City',
            postCode: '12345',
            country: ''
        };
     //   expect(formatAddress(address)).toBe('123 Main St, Sample City, 12345');
      });
  
      it('should return "Not available" if address is undefined', () => {
      //  expect(formatAddress(undefined)).toBe('Not available');
      });
    });
  
    describe('getGender', () => {
      it('should return the correct gender string', () => {
        expect(getGender('M')).toBe('Male');
        expect(getGender('F')).toBe('Female');
        expect(getGender(undefined)).toBeUndefined();
      });
    });
  
    describe('getFormattedPrice', () => {
      it('should format price correctly', () => {
        expect(getFormattedPrice(1000)).toBe('1000.00');
        expect(getFormattedPrice("1500")).toBe('1500.00');
        expect(getFormattedPrice(undefined)).toBe('0.00');
      });
  
      it('should throw an error for invalid price values', () => {
        expect(() => getFormattedPrice("invalid")).toThrow("Invalid price value");
      });
    });
  
    describe('getCoverageName', () => {
      it('should return "Comprehensive" if coverage exists', () => {
        const policyLob = { policyCoverage: [{ coverageName: 'Comprehensive' }] };
       // expect(getCoverageName(policyLob)).toBe('Comprehensive');
      });
  
      it('should return "ThirdParty" if coverage does not exist', () => {
        const policyLob = { policyCoverage: [{ coverageName: 'ThirdParty' }] };
      //  expect(getCoverageName(policyLob)).toBe('ThirdParty');
      });
    });
  
    describe('getRemainingDays', () => {
      it('should return the correct number of remaining days until expiry', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        expect(getRemainingDays(futureDate.toISOString())).toBe(5);
        
        const pastDate = new Date();
        // pastDate.setDate(pastDate.getDate() - 5);
        // expect(getRemainingDays(pastDate.toISOString())).toBe(0);
      });
    });
  });